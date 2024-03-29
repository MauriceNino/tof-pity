import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import moment from 'moment';

import { JOINT_OPS_RATES } from '../constants/joint-ops';
import {
  GearTypes,
  JODrops,
  JOStages,
  MatrixTypes,
  PerItemCount,
  SharedDropPools,
} from '../types/joint-ops';
import { forEachPoolPity, getPity, getSharedPoolsForStage } from '../util/util';
import { RootState } from './store';

export enum HistoryChangeType {
  CHEST_OPEN = 'opened_chest',
  ITEM_DROP = 'item_drop',
}

type HistoryChestOpen = {
  type: HistoryChangeType.CHEST_OPEN;
  stage: JOStages;
  withChip: boolean;
  doubleDrop: boolean;
  ts: number;
};
type HistoryItemDrop = {
  type: HistoryChangeType.ITEM_DROP;
  stage: JOStages;
  item: GearTypes | MatrixTypes;
  ts: number;

  // legacy
  dropPool?: SharedDropPools; //v1 -> v2
  pity?: number; //v1 -> v2
};

type PityHistory = {
  currentPity: number;
  carryOverFromOffPity?: number;
  onPity: boolean;
  lastPityWrong: boolean;
};

type History = HistoryChestOpen | HistoryItemDrop;

export type State = {
  changeHistory: History[];
  currentPity: {
    dropPool: Partial<Record<SharedDropPools, PityHistory[]>>;
    stages: Partial<Record<JOStages, Partial<Record<JODrops, PityHistory[]>>>>;
    lastHistoryIdx: number;
  };
  currentChips: number | null;
  doubleDrop: boolean;
  version: number;

  // legacy
  joCounts?: Partial<
    //v1 -> v2
    Record<
      JOStages,
      {
        counts: PerItemCount;
      }
    >
  >;
};

export const historyIsChestOpen = (
  history: History
): history is HistoryChestOpen => history.type === HistoryChangeType.CHEST_OPEN;

export const historyIsItemDrop = (
  history: History
): history is HistoryItemDrop => history.type === HistoryChangeType.ITEM_DROP;

export const initialState: State = {
  changeHistory: [],
  currentPity: {
    dropPool: {},
    stages: {},
    lastHistoryIdx: 0,
  },
  currentChips: null,
  doubleDrop: false,
  version: 2,
};

const updatePityForDrop = (
  currentArr: WritableDraft<PityHistory>[],
  stage: JOStages,
  item: JODrops
) => {
  if (!currentArr || currentArr.length === 0) return;

  const current = currentArr.at(-1)!;

  if (currentArr.length <= 1) {
    currentArr.push({
      currentPity: 0,
      onPity: true,
      lastPityWrong: false,
    });
  } else {
    const sf = JOINT_OPS_RATES[stage][item].specialFall;

    if (sf) {
      const lastPityWrong = current.currentPity > sf.rangeEnd;
      const isPity =
        lastPityWrong ||
        (current.currentPity >= sf.rangeStart &&
          current.currentPity <= sf.rangeEnd);

      current.onPity = isPity;
      current.lastPityWrong = lastPityWrong;

      currentArr.push({
        currentPity: isPity ? 0 : current.currentPity,
        onPity: true,
        carryOverFromOffPity: isPity ? undefined : current.currentPity,
        lastPityWrong: false,
      });
    } else {
      currentArr.push({
        currentPity: 0,
        onPity: true,
        lastPityWrong: false,
      });
    }
  }
};

const spPity = (
  state: State['currentPity']['dropPool'],
  dropPool: SharedDropPools
) => {
  if (!state[dropPool]) {
    state[dropPool] = [];
  }
  return state[dropPool]!;
};

const stagePity = (
  state: State['currentPity']['stages'],
  stage: JOStages,
  item: JODrops
) => {
  if (!state[stage]) {
    state[stage] = {};
  }
  if (!state[stage]![item]) {
    state[stage]![item] = [];
  }
  return state[stage]![item]!;
};

export const buildPityFromHistory = (
  state: WritableDraft<State>,
  forceRebuild = false
) => {
  if (forceRebuild) {
    state.currentPity = {
      dropPool: {},
      stages: {},
      lastHistoryIdx: 0,
    };
  }

  const stageState = state.currentPity.stages;
  const dpState = state.currentPity.dropPool;
  const fromIdx = state.currentPity.lastHistoryIdx;

  state.changeHistory.slice(fromIdx).forEach(his => {
    if (historyIsChestOpen(his)) {
      Object.entries(JOINT_OPS_RATES[his.stage]).forEach(([item, rates]) => {
        const pity = getPity(item as JODrops, his.withChip, his.doubleDrop);

        if (rates.dropPool) {
          const current = spPity(dpState, rates.dropPool);

          if (current.length === 0) {
            current.push({
              currentPity: pity,
              onPity: true,
              lastPityWrong: false,
            });
          } else {
            current[current.length - 1].currentPity += pity;
          }
        } else {
          const current = stagePity(stageState, his.stage, item as JODrops);

          if (current.length === 0) {
            current.push({
              currentPity: pity,
              onPity: true,
              lastPityWrong: false,
            });
          } else {
            current[current.length - 1].currentPity += pity;
          }
        }
      });
    } else if (historyIsItemDrop(his)) {
      const { dropPool } = JOINT_OPS_RATES[his.stage][his.item];

      if (dropPool) {
        updatePityForDrop(spPity(dpState, dropPool), his.stage, his.item);
      } else {
        updatePityForDrop(
          stagePity(stageState, his.stage, his.item),
          his.stage,
          his.item
        );
      }
    }
    state.currentPity.lastHistoryIdx++;
  });
};

export const stateSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    openChest: (
      state,
      {
        payload: { selectedStage, chipCounter, chipEnabled },
      }: PayloadAction<{
        selectedStage: JOStages;
        chipCounter: boolean;
        chipEnabled: boolean;
      }>
    ) => {
      const realChipEnabled = chipCounter
        ? state.currentChips != null && state.currentChips > 0
        : chipEnabled;

      if (chipCounter && state.currentChips != null && state.currentChips > 0) {
        state.currentChips -= 1;
      }

      state.changeHistory.push({
        type: HistoryChangeType.CHEST_OPEN,
        stage: selectedStage,
        withChip: realChipEnabled,
        doubleDrop: state.doubleDrop,
        ts: moment().valueOf(),
      });

      buildPityFromHistory(state);
    },
    registerDrop: (
      state,
      {
        payload: { selectedStage, drop },
      }: PayloadAction<{
        drop: JODrops;
        selectedStage: JOStages;
      }>
    ) => {
      state.changeHistory.push({
        type: HistoryChangeType.ITEM_DROP,
        stage: selectedStage,
        item: drop,
        ts: moment().valueOf(),
      });

      buildPityFromHistory(state);
    },
    goBackHistory: (
      state,
      {
        payload: { chipCounter },
      }: PayloadAction<{
        chipCounter: boolean;
      }>
    ) => {
      const lastHistory = state.changeHistory.pop();
      if (lastHistory) {
        if (historyIsChestOpen(lastHistory)) {
          if (lastHistory.withChip && chipCounter) {
            state.currentChips =
              state.currentChips == null ? 1 : state.currentChips + 1;
          }
        }

        buildPityFromHistory(state, true);
      }
    },
    overrideState: (state, action: PayloadAction<State>) => {
      state.changeHistory = action.payload.changeHistory;
      state.version = action.payload.version;
      // for legacy reasons
      state.joCounts = action.payload.joCounts;
      buildPityFromHistory(state, true);
    },
    clearHistory: state => {
      state.changeHistory = [];
    },
    removeSpecificHistory: (state, action: PayloadAction<number>) => {
      state.changeHistory.splice(action.payload, 1);
      buildPityFromHistory(state, true);
    },
    setChipCounter: (state, action: PayloadAction<number | null>) => {
      state.currentChips = action.payload;
    },
    setDoubleDrop: (state, action: PayloadAction<boolean>) => {
      state.doubleDrop = action.payload;
    },
    migrateHistoryToV1: state => {
      const pityCountInPool: Partial<Record<SharedDropPools, number>> = {};

      state.changeHistory.forEach(curr => {
        if (historyIsChestOpen(curr)) {
          getSharedPoolsForStage(curr.stage).forEach(({ item, dropPool }) => {
            pityCountInPool[dropPool] =
              (pityCountInPool[dropPool] ?? 0) + getPity(item, curr.withChip);
          });
        }
        if (historyIsItemDrop(curr)) {
          const { dropPool } = JOINT_OPS_RATES[curr.stage][curr.item];

          if (dropPool != null) {
            curr.dropPool = dropPool;
            curr.pity = pityCountInPool[dropPool] ?? 0;
            pityCountInPool[dropPool] = 0;
          }
        }
      });

      forEachPoolPity(state.joCounts, (pity, { dropPool }) => {
        if (dropPool) {
          pity.currentPity = pityCountInPool[dropPool] ?? 0;
        }
      });

      state.version = 1;
    },
    migrateToV2: state => {
      buildPityFromHistory(state, true);

      state.doubleDrop = false;
      state.joCounts = undefined;
      state.version = 2;
    },
  },
});

export const stateActions = {
  ...stateSlice.actions,
};
export const selectState = (state: RootState) => state.state;
export const stateReducer = stateSlice.reducer;
