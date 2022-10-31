import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { SUPPLY_CHIP_BEHAVIOR } from '../constants/joint-ops';
import {
  GearTypes,
  JODrops,
  JOStages,
  MatrixTypes,
  PerItemCount,
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
};

const getPity = (type: JODrops, chipEnabled: boolean) => {
  const behavior = SUPPLY_CHIP_BEHAVIOR[type];

  return chipEnabled ? behavior.withChip : behavior.withoutChip;
};

const addToAll = (
  stage: PerItemCount,
  chests: number,
  chipEnabled: boolean
) => {
  stage[GearTypes.Gold].currentPity =
    stage[GearTypes.Gold].currentPity +
    chests * getPity(GearTypes.Gold, chipEnabled);
  stage[GearTypes.Purple].currentPity =
    stage[GearTypes.Purple].currentPity +
    chests * getPity(GearTypes.Purple, chipEnabled);
  stage[GearTypes.Blue].currentPity =
    stage[GearTypes.Blue].currentPity +
    chests * getPity(GearTypes.Blue, chipEnabled);
  stage[GearTypes.Green].currentPity =
    stage[GearTypes.Green].currentPity +
    chests * getPity(GearTypes.Green, chipEnabled);
  stage[MatrixTypes.Gold].currentPity =
    stage[MatrixTypes.Gold].currentPity +
    chests * getPity(MatrixTypes.Gold, chipEnabled);
  stage[MatrixTypes.Purple].currentPity =
    stage[MatrixTypes.Purple].currentPity +
    chests * getPity(MatrixTypes.Purple, chipEnabled);
  stage[MatrixTypes.Blue].currentPity =
    stage[MatrixTypes.Blue].currentPity +
    chests * getPity(MatrixTypes.Blue, chipEnabled);
  stage[MatrixTypes.Green].currentPity =
    stage[MatrixTypes.Green].currentPity +
    chests * getPity(MatrixTypes.Green, chipEnabled);
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
      const stage = state.joCounts[selectedStage];

      const realChipEnabled = chipCounter
        ? state.currentChips != null && state.currentChips > 0
        : chipEnabled;

      if (stage != null) {
        addToAll(stage.counts, 1, realChipEnabled);
      } else {
        state.joCounts[selectedStage] = {
          counts: Object.fromEntries(
            types.map(t => [t, { currentPity: getPity(t, realChipEnabled) }])
          ) as PerItemCount,
        };
      }

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
        state.changeHistory.push({
          type: HistoryChangeType.ITEM_DROP,
          stage: selectedStage,
          item: drop,
          pity: stage.counts[drop].currentPity,
          ts: moment().valueOf(),
        });

        stage.counts[drop].currentPity = 0;
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
        const stage = state.joCounts[lastHistory.stage];

        if (historyIsChestOpen(lastHistory) && stage) {
          addToAll(stage.counts, -1, lastHistory.withChip);

          if (lastHistory.withChip && chipCounter) {
            state.currentChips =
              state.currentChips == null ? 1 : state.currentChips + 1;
          }
        }
        if (historyIsItemDrop(lastHistory) && stage) {
          stage.counts[lastHistory.item].currentPity = lastHistory.pity;
        }
      }
    },
    overrideState: (state, action: PayloadAction<State>) => {
      state.changeHistory = action.payload.changeHistory;
      state.joCounts = action.payload.joCounts;
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
  },
});

export const stateActions = {
  ...stateSlice.actions,
};
export const selectState = (state: RootState) => state.state;
export const stateReducer = stateSlice.reducer;
