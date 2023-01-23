import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import moment from 'moment';

import { JOINT_OPS_RATES, SUPPLY_CHIP_BEHAVIOR } from '../constants/joint-ops';
import {
  GearTypes,
  JODrops,
  JOStages,
  MatrixTypes,
  PerItemCount,
  SharedDropPools,
} from '../types/joint-ops';
import { RootState } from './store';

export enum HistoryChangeType {
  CHEST_OPEN = 'opened_chest',
  ITEM_DROP = 'item_drop',
}

type HistoryChestOpen = {
  type: HistoryChangeType.CHEST_OPEN;
  stage: JOStages;
  withChip: boolean;
  ts: number;
};
type HistoryItemDrop = {
  type: HistoryChangeType.ITEM_DROP;
  stage: JOStages;
  dropPool?: SharedDropPools;
  item: GearTypes | MatrixTypes;
  pity: number;
  ts: number;
};

type History = HistoryChestOpen | HistoryItemDrop;

export type State = {
  joCounts: Partial<
    Record<
      JOStages,
      {
        counts: PerItemCount;
      }
    >
  >;
  changeHistory: History[];
  currentChips: number | null;
  version: number;
};

export const historyIsChestOpen = (
  history: History
): history is HistoryChestOpen => history.type === HistoryChangeType.CHEST_OPEN;

export const historyIsItemDrop = (
  history: History
): history is HistoryItemDrop => history.type === HistoryChangeType.ITEM_DROP;

const initialState: State = {
  joCounts: {},
  changeHistory: [],
  currentChips: null,
  version: 1,
};

const getPity = (type: JODrops, chipEnabled: boolean) => {
  const behavior = SUPPLY_CHIP_BEHAVIOR[type];

  return chipEnabled ? behavior.withChip : behavior.withoutChip;
};

const getSharedPoolsForStage = (stage: JOStages) => {
  return Object.entries(JOINT_OPS_RATES[stage]).reduce(
    (acc, [item, { dropPool }]) => {
      if (dropPool != null) {
        acc.push({
          item: item as JODrops,
          dropPool,
        });
      }
      return acc;
    },
    [] as { item: JODrops; dropPool: SharedDropPools }[]
  );
};

const getStagesForPool = (dropPool: SharedDropPools) => {
  return Object.entries(JOINT_OPS_RATES)
    .filter(([stage, items]) =>
      Object.entries(items).some(([, rates]) => rates.dropPool === dropPool)
    )
    .map(([stage]) => stage as JOStages);
};

const addToAll = (
  state: WritableDraft<State>,
  stage: JOStages,
  chests: number,
  chipEnabled: boolean
) => {
  const pools = getSharedPoolsForStage(stage);

  pools.forEach(({ item: dpItem, dropPool }) => {
    const dpStages = getStagesForPool(dropPool);
    dpStages.forEach(dpStage => {
      if (state.joCounts[dpStage] == null) {
        state.joCounts[dpStage] = {
          counts: Object.fromEntries(
            types.map(t => [t, { currentPity: 0 }])
          ) as PerItemCount,
        };
      }

      Object.entries(state.joCounts[dpStage]!.counts).forEach(
        ([item, pity]) => {
          if (dpStage !== stage && item === dpItem) {
            pity.currentPity =
              pity.currentPity + chests * getPity(item as JODrops, chipEnabled);
          }
        }
      );
    });
  });

  Object.entries(state.joCounts[stage]!.counts).forEach(([item, pity]) => {
    pity.currentPity =
      pity.currentPity + chests * getPity(item as JODrops, chipEnabled);
  });
};

const types = [
  GearTypes.Gold,
  MatrixTypes.Gold,
  GearTypes.Purple,
  MatrixTypes.Purple,
  GearTypes.Blue,
  MatrixTypes.Blue,
  GearTypes.Green,
  MatrixTypes.Green,
];

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

      addToAll(state, selectedStage, 1, realChipEnabled);

      if (chipCounter && state.currentChips != null && state.currentChips > 0) {
        state.currentChips = state.currentChips - 1;
      }

      state.changeHistory.push({
        type: HistoryChangeType.CHEST_OPEN,
        stage: selectedStage,
        withChip: realChipEnabled,
        ts: moment().valueOf(),
      });
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
      const stage = state.joCounts[selectedStage];
      if (stage) {
        const { dropPool } = JOINT_OPS_RATES[selectedStage][drop];

        state.changeHistory.push({
          type: HistoryChangeType.ITEM_DROP,
          stage: selectedStage,
          item: drop,
          pity: stage.counts[drop].currentPity,
          ts: moment().valueOf(),
          dropPool,
        });

        if (dropPool) {
          Object.entries(state.joCounts).forEach(([stage, { counts }]) => {
            Object.entries(counts).forEach(([item, pity]) => {
              const current =
                JOINT_OPS_RATES[stage as JOStages][item as JODrops];
              if (current.dropPool === dropPool) {
                pity.currentPity = 0;
              }
            });
          });
        } else {
          stage.counts[drop].currentPity = 0;
        }
      }
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
          addToAll(state, lastHistory.stage, -1, lastHistory.withChip);

          if (lastHistory.withChip && chipCounter) {
            state.currentChips =
              state.currentChips == null ? 1 : state.currentChips + 1;
          }
        }
        if (historyIsItemDrop(lastHistory)) {
          if (lastHistory.dropPool) {
            getStagesForPool(lastHistory.dropPool).forEach(stage => {
              state.joCounts[stage]!.counts[lastHistory.item].currentPity =
                lastHistory.pity;
            });
          } else {
            state.joCounts[lastHistory.stage]!.counts[
              lastHistory.item
            ].currentPity = lastHistory.pity;
          }
        }
      }
    },
    overrideState: (state, action: PayloadAction<State>) => {
      state.changeHistory = action.payload.changeHistory;
      state.joCounts = action.payload.joCounts;
      state.version = action.payload.version;
    },
    clearHistory: state => {
      state.changeHistory = [];
    },
    removeSpecificHistory: (state, action: PayloadAction<number>) => {
      state.changeHistory.splice(action.payload, 1);
    },
    setChipCounter: (state, action: PayloadAction<number | null>) => {
      state.currentChips = action.payload;
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

      Object.entries(state.joCounts).forEach(([stage, { counts }]) => {
        Object.entries(counts).forEach(([item, pity]) => {
          const { dropPool } =
            JOINT_OPS_RATES[stage as JOStages][item as JODrops];
          if (dropPool) {
            pity.currentPity = pityCountInPool[dropPool] ?? 0;
          }
        });
      });

      state.version = 1;
    },
  },
});

export const stateActions = {
  ...stateSlice.actions,
};
export const selectState = (state: RootState) => state.state;
export const stateReducer = stateSlice.reducer;
