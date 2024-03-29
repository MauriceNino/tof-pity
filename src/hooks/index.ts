import { useMantineTheme } from '@mantine/core';
import { useEffect, useState } from 'react';

import { JOINT_OPS_RATES } from '../constants/joint-ops';
import {
  initialSettingsState,
  selectSettings,
  settingsActions,
} from '../redux/settingsSlice';
import { initialState, selectState, stateActions } from '../redux/stateSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { GearTypes, JODrops, JOStages, MatrixTypes } from '../types/joint-ops';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const useIsCompact = () => {
  const ws = useWindowSize();
  const theme = useMantineTheme();

  return (
    ws != null &&
    (ws.width < theme.breakpoints.md || ws.height < theme.breakpoints.xs)
  );
};

export const useDropTableOrder = (respectSettings = true) => {
  const { goldEnabled, purpleEnabled, blueEnabled, greenEnabled } =
    useAppSelector(selectSettings);

  const dropTable: JODrops[] = [];

  if (goldEnabled || !respectSettings)
    dropTable.push(GearTypes.Gold, MatrixTypes.Gold);
  if (purpleEnabled || !respectSettings)
    dropTable.push(GearTypes.Purple, MatrixTypes.Purple);
  if (blueEnabled || !respectSettings)
    dropTable.push(GearTypes.Blue, MatrixTypes.Blue);
  if (greenEnabled || !respectSettings)
    dropTable.push(GearTypes.Green, MatrixTypes.Green);

  return dropTable;
};

export const usePity = (stage: JOStages, item: JODrops) => {
  const state = useAppSelector(selectState);

  const { dropPool } = JOINT_OPS_RATES[stage][item];

  const pityArr = dropPool
    ? state.currentPity.dropPool[dropPool]
    : state.currentPity.stages[stage]?.[item];

  const pity = pityArr?.at(-1);

  return {
    pity: pity?.currentPity ?? 0,
    carryOver: pity?.carryOverFromOffPity ?? 0,
    dropped: pityArr?.length ?? 0,
  };
};

export const useVersionMigrations = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const state = useAppSelector(selectState);

  useEffect(() => {
    if (settings.compactLayout == null) {
      dispatch(settingsActions.changeSetting({ compactLayout: true }));
    }
    if (settings.chipCounter == null) {
      dispatch(settingsActions.changeSetting({ chipCounter: false }));
    }
    if (settings.chipCounterWarning == null) {
      dispatch(settingsActions.changeSetting({ chipCounterWarning: true }));
    }
    if (settings.countChestAsOnePity == null) {
      dispatch(settingsActions.changeSetting({ countChestAsOnePity: true }));
    }
  }, []);

  useEffect(() => {
    if (settings.version == null) {
      dispatch(settingsActions.changeSetting({ version: 1 }));
    }

    if (state.version == null) {
      dispatch(stateActions.migrateHistoryToV1());
    }

    if (state.version == 1) {
      dispatch(stateActions.migrateToV2());
    }
  }, [settings.version, state.version]);

  return (
    state.version < initialState.version ||
    settings.version < initialSettingsState.version
  );
};
