import { Button, Group, Select, Switch } from "@mantine/core";
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
import { SettingsMenu } from "./settings-menu";

export const ActionsRow: FC = () => {
  const dispatch = useAppDispatch();
  const { selectedStage, chipEnabled } = useAppSelector(selectSettings);

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

        <SettingsMenu />
      </Group>
    </>
  );
};
