import {
  Button,
  Group,
  Select,
  Switch,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { FC } from 'react';

import SupplyChip from '../assets/supply_chip.png';
import { JOINT_OPS_NAMES } from '../constants/joint-ops';
import { useWindowSize } from '../hooks';
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from '../redux/settingsSlice';
import { selectState, stateActions } from '../redux/stateSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { JOStages } from '../types/joint-ops';
import { SettingsMenu } from './settings-menu';

const COMPACT_MENU_BREAKPOINT = 680;
const SEPARATE_BUTTON_BREAKPOINT = 440;

export const ActionsRow: FC = () => {
  const dispatch = useAppDispatch();
  const {
    selectedStage,
    chipEnabled,
    compactLayout,
    chipCounter,
    chipCounterWarning,
  } = useAppSelector(selectSettings);
  const state = useAppSelector(selectState);

  const { colors } = useMantineTheme();

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));

  const { width } = useWindowSize();
  const isCompactMenu = width < COMPACT_MENU_BREAKPOINT && compactLayout;
  const isSeparateButton = width < SEPARATE_BUTTON_BREAKPOINT && compactLayout;

  const { height } = useWindowSize();

  return (
    <Group position='apart' sx={{ flexWrap: 'nowrap' }}>
      <Group>
        <Select
          value={selectedStage}
          onChange={v => changeSetting('selectedStage', v as JOStages)}
          data={Object.entries(JOINT_OPS_NAMES).map(
            ([stage, [name, short_name]]) => ({
              value: stage,
              label: isCompactMenu ? short_name : name,
            })
          )}
          transition='fade'
          transitionDuration={120}
          maxDropdownHeight={Math.max(Math.min(height - 100, 280), 100)}
          sx={{
            width: isCompactMenu ? 100 : 230,
            transition: 'width .3s ease-in-out',
          }}
        />
        {chipCounter && (
          <TextInput
            value={state.currentChips == null ? '' : state.currentChips}
            onChange={e =>
              dispatch(
                stateActions.setChipCounter(
                  e.currentTarget.value === '' ? null : +e.currentTarget.value
                )
              )
            }
            icon={
              <img
                alt='Supply Chip'
                style={{ width: '80%', height: '80%' }}
                src={SupplyChip}
              />
            }
            placeholder={isCompactMenu ? 'Chips' : 'Supply Chips'}
            sx={{
              width: isCompactMenu ? 90 : 130,
              transition: 'width .3s ease-in-out',
              input: {
                borderColor: chipCounterWarning
                  ? state.currentChips == null || state.currentChips === 0
                    ? colors.red[5]
                    : state.currentChips <= 6
                    ? colors.orange[4]
                    : undefined
                  : undefined,
              },
            }}
          />
        )}

        <Button
          onClick={() =>
            dispatch(
              stateActions.openChest({
                chipCounter,
                chipEnabled,
                selectedStage,
              })
            )
          }
          sx={
            isSeparateButton
              ? {
                  position: 'fixed',
                  bottom: 20,
                  left: 20,
                  right: 20,
                }
              : undefined
          }
        >
          {isCompactMenu ? 'Chest' : 'Chest opened'}
        </Button>

        {!chipCounter && (
          <Switch
            label={isCompactMenu ? 'JO-Chip' : 'JO-Chip enabled'}
            checked={chipEnabled}
            onChange={e =>
              changeSetting('chipEnabled', e.currentTarget.checked)
            }
          />
        )}
      </Group>

      <SettingsMenu />
    </Group>
  );
};
