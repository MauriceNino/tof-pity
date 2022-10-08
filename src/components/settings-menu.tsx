import { ActionIcon, Group, Menu, Switch, Text } from "@mantine/core";
import {
  IconArrowBackUp,
  IconBrandGithub,
  IconQuestionMark,
  IconSettings,
} from "@tabler/icons";
import { FC, useState } from "react";
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from "../redux/settingsSlice";
import { stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { HelpPopup } from "./help-popup";

export const SettingsMenu: FC = () => {
  const dispatch = useAppDispatch();
  const { goldEnabled, purpleEnabled, blueEnabled, greenEnabled } =
    useAppSelector(selectSettings);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));

  const [helpOpened, setHelpOpened] = useState(false);

  return (
    <Group sx={{ flexWrap: "nowrap", alignSelf: "flex-start" }}>
      <ActionIcon
        size="lg"
        variant="transparent"
        onClick={() => dispatch(stateActions.goBackHistory())}
      >
        <IconArrowBackUp size={26} />
      </ActionIcon>

      <HelpPopup opened={helpOpened} close={() => setHelpOpened(false)} />
      <Menu shadow="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon size="lg">
            <IconSettings size={26} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Enabled Items</Menu.Label>
          <Menu.Item
            closeMenuOnClick={false}
            onClick={() => changeSetting("goldEnabled", !goldEnabled)}
          >
            <Group position="apart">
              <Text>Gold</Text>
              <Switch
                checked={goldEnabled}
                onChange={(e) => changeSetting("goldEnabled", goldEnabled)}
              />
            </Group>
          </Menu.Item>
          <Menu.Item
            closeMenuOnClick={false}
            onClick={() => changeSetting("purpleEnabled", !purpleEnabled)}
          >
            <Group position="apart">
              <Text>Purple</Text>
              <Switch
                checked={purpleEnabled}
                onChange={(e) => changeSetting("purpleEnabled", purpleEnabled)}
              />
            </Group>
          </Menu.Item>
          <Menu.Item
            closeMenuOnClick={false}
            onClick={() => changeSetting("blueEnabled", !blueEnabled)}
          >
            <Group position="apart">
              <Text>Blue</Text>
              <Switch
                checked={blueEnabled}
                onChange={(e) => changeSetting("blueEnabled", blueEnabled)}
              />
            </Group>
          </Menu.Item>
          <Menu.Item
            closeMenuOnClick={false}
            onClick={() => changeSetting("greenEnabled", !greenEnabled)}
          >
            <Group position="apart">
              <Text>Green</Text>
              <Switch
                checked={greenEnabled}
                onChange={(e) => changeSetting("greenEnabled", greenEnabled)}
              />
            </Group>
          </Menu.Item>

          <Menu.Label>Misc.</Menu.Label>
          <Menu.Item
            icon={<IconQuestionMark size={14} />}
            onClick={() => setHelpOpened(true)}
          >
            Help
          </Menu.Item>
          <Menu.Item
            icon={<IconBrandGithub size={14} />}
            component="a"
            href="https://github.com/MauriceNino/tof-pity"
            target="_blank"
          >
            GitHub Project
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};
