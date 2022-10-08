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

type State = {
  joCounts: Partial<
    Record<
      JOStages,
      {
        counts: PerItemCount;
      }
    >
  >;
  changeHistory: (
    | {
        type: HistoryChangeType.CHEST_OPEN;
        withChip: boolean;
      }
    | {
        type: HistoryChangeType.ITEM_DROP;
        item: GearTypes | MatrixTypes;
      }
  )[];
};
const initialState: State = {
  joCounts: {},
  changeHistory: [],
};

const getPity = (type: JODrops, chipEnabled: boolean) => {
  const behavior = SUPPLY_CHIP_BEHAVIOR[type];

  return chipEnabled ? behavior.withChip : behavior.withoutChip;
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
        stage.counts = Object.fromEntries(
          types.map((t) => [
            t,
            {
              currentPity:
                stage.counts[t].currentPity +
                getPity(t, action.payload.chipEnabled),
            },
          ])
        ) as PerItemCount;
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
        withChip: action.payload.chipEnabled,
      });
    },
    registerDrop: (
      state,
      action: PayloadAction<{ stage: JOStages; type: JODrops }>
    ) => {
      const stage = state.joCounts[action.payload.stage];
      if (stage) {
        stage.counts[action.payload.type].currentPity = 0;

        state.changeHistory.push({
          type: HistoryChangeType.ITEM_DROP,
          item: action.payload.type,
        });
      }
    },
  },
});

export const stateActions = {
  ...stateSlice.actions,
};
export const selectState = (state: RootState) => state.state;
export const stateReducer = stateSlice.reducer;
