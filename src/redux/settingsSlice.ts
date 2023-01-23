import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JOStages } from '../types/joint-ops';
import { RootState } from './store';

export type SettingsState = {
  selectedStage: JOStages;
  chipEnabled: boolean;
  goldEnabled: boolean;
  purpleEnabled: boolean;
  blueEnabled: boolean;
  greenEnabled: boolean;
  compactLayout: boolean;
  chipCounter: boolean;
  chipCounterWarning: boolean;
  version: number;
};

const initialState: SettingsState = {
  selectedStage: JOStages.VII,
  chipEnabled: true,
  goldEnabled: true,
  purpleEnabled: true,
  blueEnabled: true,
  greenEnabled: true,
  compactLayout: true,
  chipCounter: false,
  chipCounterWarning: true,
  version: 1,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeSetting: (state, action: PayloadAction<Partial<SettingsState>>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        //@ts-ignore
        state[key] = value;
      });
    },
  },
});

export const settingsActions = {
  ...settingsSlice.actions,
};
export const selectSettings = (state: RootState) => state.settings;
export const settingsReducer = settingsSlice.reducer;
