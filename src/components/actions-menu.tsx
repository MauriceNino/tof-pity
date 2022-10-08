import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Select,
  Switch,
  Text,
} from "@mantine/core";
import { IconArrowBackUp, IconBrandGithub, IconSettings } from "@tabler/icons";
import { FC } from "react";
import { JOINT_OPS_NAMES } from "../constants/joint-ops";
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from "../redux/settingsSlice";
import { stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { JOStages } from "../types/joint-ops";

export const ActionsMenu: FC = () => {
  const dispatch = useAppDispatch();
  const {
    selectedStage,
    chipEnabled,
    goldEnabled,
    purpleEnabled,
    blueEnabled,
    greenEnabled,
  } = useAppSelector(selectSettings);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));

  return (
    <>
      <Group position="apart" sx={{ flexWrap: "nowrap" }}>
        <Group sx={{ alignItems: "flex-end" }}>
          <Select
            value={selectedStage}
            onChange={(v) => changeSetting("selectedStage", v as JOStages)}
            data={Object.entries(JOINT_OPS_NAMES).map(([stage, name]) => ({
              value: stage,
              label: name,
            }))}
            sx={{
              width: 220,
            }}
          />

          <Group>
            <Button
              onClick={() =>
                dispatch(
                  stateActions.openChest({ stage: selectedStage, chipEnabled })
                )
              }
            >
              Chest opened
            </Button>
            <Switch
              label="JO-Chip enabled"
              checked={chipEnabled}
              onChange={(e) =>
                changeSetting("chipEnabled", e.currentTarget.checked)
              }
            />
          </Group>
        </Group>

        <Group sx={{ flexWrap: "nowrap", alignSelf: "flex-start" }}>
          <ActionIcon
            size="lg"
            variant="transparent"
            onClick={() => dispatch(stateActions.goBackHistory())}
          >
            <IconArrowBackUp size={26} />
          </ActionIcon>

          <Menu shadow="md" position="bottom-end">
            <Menu.Target>
              <ActionIcon size="lg" variant="outline">
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
                    onClick={(e) =>
                      changeSetting("goldEnabled", e.currentTarget.checked)
                    }
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
                    onClick={(e) =>
                      changeSetting("purpleEnabled", e.currentTarget.checked)
                    }
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
                    onClick={(e) =>
                      changeSetting("blueEnabled", e.currentTarget.checked)
                    }
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
                    onClick={(e) =>
                      changeSetting("greenEnabled", e.currentTarget.checked)
                    }
                  />
                </Group>
              </Menu.Item>

              <Menu.Label>Misc.</Menu.Label>
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
      </Group>
    </>
  );
};
