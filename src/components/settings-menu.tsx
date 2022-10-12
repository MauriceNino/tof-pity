import { ActionIcon, Group, Menu } from "@mantine/core";
import {
  IconArrowBackUp,
  IconBrandGithub,
  IconHelp,
  IconServer,
  IconSettings,
  IconTool,
} from "@tabler/icons";
import { FC, useState } from "react";
import { HelpModal } from "../modals/help";
import { HistoryModal } from "../modals/history";
import { SettingsModal } from "../modals/settings";
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from "../redux/settingsSlice";
import { selectState, stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const SettingsMenu: FC = () => {
  const dispatch = useAppDispatch();
  const {
    goldEnabled,
    purpleEnabled,
    blueEnabled,
    greenEnabled,
    compactLayout,
  } = useAppSelector(selectSettings);
  const { changeHistory } = useAppSelector(selectState);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));

  const [helpOpened, setHelpOpened] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [historyOpened, setHistoryOpened] = useState(false);

  return (
    <Group sx={{ flexWrap: "nowrap", alignSelf: "flex-start" }}>
      <ActionIcon
        size="lg"
        variant="transparent"
        disabled={changeHistory.length === 0}
        onClick={() => dispatch(stateActions.goBackHistory())}
      >
        <IconArrowBackUp size={26} />
      </ActionIcon>

      <HelpModal opened={helpOpened} close={() => setHelpOpened(false)} />
      <SettingsModal
        opened={settingsOpened}
        close={() => setSettingsOpened(false)}
      />
      <HistoryModal
        opened={historyOpened}
        close={() => setHistoryOpened(false)}
      />

      <Menu shadow="md" radius="md" position="bottom-end">
        <Menu.Target>
          <ActionIcon size="lg">
            <IconSettings size={26} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconTool size={14} />}
            onClick={() => setSettingsOpened(true)}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            icon={<IconServer size={14} />}
            onClick={() => setHistoryOpened(true)}
          >
            History
          </Menu.Item>
          <Menu.Item
            icon={<IconHelp size={14} />}
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
