import {
  Box,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';

import {
  selectSettings,
  settingsActions,
  SettingsState,
} from '../redux/settingsSlice';
import { selectState, stateActions } from '../redux/stateSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

const MotionGroup = motion(Group);

export const SettingsModal: FC<{ opened: boolean; close: () => void }> = ({
  opened,
  close,
}) => {
  const dispatch = useAppDispatch();
  const {
    goldEnabled,
    purpleEnabled,
    blueEnabled,
    greenEnabled,
    compactLayout,
    chipCounter,
    chipCounterWarning,
    countChestAsOnePity,
  } = useAppSelector(selectSettings);
  const { doubleDrop } = useAppSelector(selectState);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));
  const { colors } = useMantineTheme();

  return (
    <Modal
      size='lg'
      radius='lg'
      styles={{
        modal: {
          backgroundColor: colors.dark[5],
        },
      }}
      opened={opened}
      onClose={close}
      title='Settings'
    >
      <Stack spacing='xl'>
        <Box>
          <Stack spacing='xs'>
            <Text weight='bold'>Features</Text>
            <Tooltip
              multiline
              width='auto'
              withArrow
              position='bottom'
              transition='fade'
              label='Allow the components to fade in/out when the browser window changes its size.'
            >
              <Group position='apart'>
                <Text>Compact Layout</Text>
                <Switch
                  checked={compactLayout}
                  onChange={() =>
                    changeSetting('compactLayout', !compactLayout)
                  }
                />
              </Group>
            </Tooltip>
            <Tooltip
              multiline
              width='auto'
              withArrow
              position='bottom'
              transition='fade'
              label='Track the current JO-Chips using an exact counter. This is useful if you want to keep track of your JO-Chips also, because you might easily miss them in the buff-bar ingame.'
            >
              <Group position='apart'>
                <Text>JO-Chip Counter</Text>
                <Switch
                  checked={chipCounter}
                  onChange={() => changeSetting('chipCounter', !chipCounter)}
                />
              </Group>
            </Tooltip>
            <AnimatePresence initial={false}>
              {chipCounter && (
                <Tooltip
                  multiline
                  width='auto'
                  withArrow
                  position='bottom'
                  transition='fade'
                  label='When the JO-Chips come to a low amount (lower than 6), the input will appear in a warn color. When the counter reaches 0, it will appear in an error color.'
                >
                  <MotionGroup
                    style={{ overflow: 'hidden' }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    position='apart'
                  >
                    <Text>JO-Chip Counter Warning</Text>
                    <Switch
                      checked={chipCounterWarning}
                      onChange={() =>
                        changeSetting('chipCounterWarning', !chipCounterWarning)
                      }
                    />
                  </MotionGroup>
                </Tooltip>
              )}
            </AnimatePresence>
            <Tooltip
              multiline
              width='auto'
              withArrow
              position='bottom'
              transition='fade'
              label='Some resources count pity in steps of 0.5, some do it in steps of 1. To make the experience more consistent, we chose the pity in steps of 1, but if you prefer it the other way, disable this option.'
            >
              <Group position='apart'>
                <Text>Count Chest as 1 Pity</Text>
                <Switch
                  checked={countChestAsOnePity}
                  onChange={() =>
                    changeSetting('countChestAsOnePity', !countChestAsOnePity)
                  }
                />
              </Group>
            </Tooltip>
          </Stack>
        </Box>

        <Stack spacing='xs'>
          <Text weight='bold'>Events</Text>
          <Tooltip
            multiline
            width='auto'
            withArrow
            position='bottom'
            transition='fade'
            label='When there is a double drop event in game you can flip this switch manually, to update the pity accordingly. Normally this is done for you when an event is running.'
          >
            <Group position='apart'>
              <Text>Double Drop Event</Text>
              <Switch
                checked={doubleDrop}
                onChange={() =>
                  dispatch(stateActions.setDoubleDrop(!doubleDrop))
                }
              />
            </Group>
          </Tooltip>
        </Stack>

        <Stack spacing='xs'>
          <Text weight='bold'>Enabled Items</Text>
          <Group position='apart'>
            <Text>Gold</Text>
            <Switch
              checked={goldEnabled}
              onChange={() => changeSetting('goldEnabled', !goldEnabled)}
            />
          </Group>
          <Group position='apart'>
            <Text>Purple</Text>
            <Switch
              checked={purpleEnabled}
              onChange={() => changeSetting('purpleEnabled', !purpleEnabled)}
            />
          </Group>
          <Group position='apart'>
            <Text>Blue</Text>
            <Switch
              checked={blueEnabled}
              onChange={() => changeSetting('blueEnabled', !blueEnabled)}
            />
          </Group>
          <Group position='apart'>
            <Text>Green</Text>
            <Switch
              checked={greenEnabled}
              onChange={() => changeSetting('greenEnabled', !greenEnabled)}
            />
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
};
