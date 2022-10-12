import {
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { FC } from "react";
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from "../redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

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
  } = useAppSelector(selectSettings);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));
  const { colors } = useMantineTheme();

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
        <Stack spacing="xs">
          <Text weight="bold">Features</Text>
          <Group position="apart">
            <Text>Compact Layout</Text>
            <Switch
              checked={compactLayout}
              onChange={() => changeSetting("compactLayout", !compactLayout)}
            />
          </Group>
        </Stack>

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
