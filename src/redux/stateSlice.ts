import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SUPPLY_CHIP_BEHAVIOR } from "../constants/joint-ops";
import {
  GearTypes,
  JODrops,
  JOStages,
  MatrixTypes,
  PerItemCount,
} from "../types/joint-ops";
import { RootState } from "./store";

export enum HistoryChangeType {
  CHEST_OPEN = "opened_chest",
  ITEM_DROP = "item_drop",
}

type HistoryChestOpen = {
  type: HistoryChangeType.CHEST_OPEN;
  stage: JOStages;
  withChip: boolean;
};
type HistoryItemDrop = {
  type: HistoryChangeType.ITEM_DROP;
  stage: JOStages;
  item: GearTypes | MatrixTypes;
  pity: number;
};

type History = HistoryChestOpen | HistoryItemDrop;

type State = {
  joCounts: Partial<
    Record<
      JOStages,
      {
        counts: PerItemCount;
      }
    >
  >;
  changeHistory: History[];
};

const historyIsChestOpen = (history: History): history is HistoryChestOpen =>
  history.type === HistoryChangeType.CHEST_OPEN;

const historyIsItemDrop = (history: History): history is HistoryItemDrop =>
  history.type === HistoryChangeType.ITEM_DROP;

const initialState: State = {
  joCounts: {},
  changeHistory: [],
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
  name: "state",
  initialState,
  reducers: {
    openChest: (
      state,
      action: PayloadAction<{ stage: JOStages; chipEnabled: boolean }>
    ) => {
      const stage = state.joCounts[action.payload.stage];
      if (stage != null) {
        addToAll(stage.counts, 1, action.payload.chipEnabled);
      } else {
        state.joCounts[action.payload.stage] = {
          counts: Object.fromEntries(
            types.map((t) => [
              t,
              { currentPity: getPity(t, action.payload.chipEnabled) },
            ])
          ) as PerItemCount,
        };
      }

      state.changeHistory.push({
        type: HistoryChangeType.CHEST_OPEN,
        stage: action.payload.stage,
        withChip: action.payload.chipEnabled,
      });
    },
    registerDrop: (
      state,
      action: PayloadAction<{ stage: JOStages; type: JODrops }>
    ) => {
      const stage = state.joCounts[action.payload.stage];
      if (stage) {
        state.changeHistory.push({
          type: HistoryChangeType.ITEM_DROP,
          stage: action.payload.stage,
          item: action.payload.type,
          pity: stage.counts[action.payload.type].currentPity,
        });

        stage.counts[action.payload.type].currentPity = 0;
      }
    },
    goBackHistory: (state) => {
      const lastHistory = state.changeHistory.pop();
      if (lastHistory) {
        const stage = state.joCounts[lastHistory.stage];

        if (historyIsChestOpen(lastHistory) && stage) {
          addToAll(stage.counts, -1, lastHistory.withChip);
        }
        if (historyIsItemDrop(lastHistory) && stage) {
          stage.counts[lastHistory.item].currentPity = lastHistory.pity;
        }
      }
    },
  },
});

export const stateActions = {
  ...stateSlice.actions,
};
export const selectState = (state: RootState) => state.state;
export const stateReducer = stateSlice.reducer;
