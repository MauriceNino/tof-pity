import {
  Box,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from "../redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

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
  } = useAppSelector(selectSettings);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));
  const { colors, spacing } = useMantineTheme();

  return (
    <Modal
      size="lg"
      radius="lg"
      styles={{
        modal: {
          backgroundColor: colors.dark[5],
        },
      }}
      opened={opened}
      onClose={close}
      title="Settings"
    >
      <Stack spacing="xl">
        <Box>
          <Stack spacing="xs">
            <Text weight="bold">Features</Text>
            <Group position="apart">
              <Text>Compact Layout</Text>
              <Switch
                checked={compactLayout}
                onChange={() => changeSetting("compactLayout", !compactLayout)}
              />
            </Group>
            <Group position="apart">
              <Text>JO-Chip Counter</Text>
              <Switch
                checked={chipCounter}
                onChange={() => changeSetting("chipCounter", !chipCounter)}
              />
            </Group>
          </Stack>
          <AnimatePresence>
            {chipCounter && (
              <MotionGroup
                style={{ overflow: "hidden" }}
                initial={{ height: 0, marginTop: 0, opacity: 0 }}
                animate={{ height: "auto", marginTop: spacing.xs, opacity: 1 }}
                exit={{ height: 0, marginTop: 0, opacity: 0 }}
                position="apart"
              >
                <Text>JO-Chip Counter Warning</Text>
                <Switch
                  checked={chipCounterWarning}
                  onChange={() =>
                    changeSetting("chipCounterWarning", !chipCounterWarning)
                  }
                />
              </MotionGroup>
            )}
          </AnimatePresence>
        </Box>

        <Stack spacing="xs">
          <Text weight="bold">Enabled Items</Text>
          <Group position="apart">
            <Text>Gold</Text>
            <Switch
              checked={goldEnabled}
              onChange={() => changeSetting("goldEnabled", !goldEnabled)}
            />
          </Group>
          <Group position="apart">
            <Text>Purple</Text>
            <Switch
              checked={purpleEnabled}
              onChange={() => changeSetting("purpleEnabled", !purpleEnabled)}
            />
          </Group>
          <Group position="apart">
            <Text>Blue</Text>
            <Switch
              checked={blueEnabled}
              onChange={() => changeSetting("blueEnabled", !blueEnabled)}
            />
          </Group>
          <Group position="apart">
            <Text>Green</Text>
            <Switch
              checked={greenEnabled}
              onChange={() => changeSetting("greenEnabled", !greenEnabled)}
            />
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
};
