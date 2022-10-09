import { Button, Group, Select, Switch } from "@mantine/core";
import { FC } from "react";
import { JOINT_OPS_NAMES } from "../constants/joint-ops";
import { useWindowSize } from "../hooks";
import {
  selectSettings,
  settingsActions,
  SettingsState,
} from "../redux/settingsSlice";
import { stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { JOStages } from "../types/joint-ops";
import { SettingsMenu } from "./settings-menu";

const COMPACT_MENU_BREAKPOINT = 680;
const SEPARATE_BUTTON_BREAKPOINT = 435;

export const ActionsRow: FC = () => {
  const dispatch = useAppDispatch();
  const { selectedStage, chipEnabled, compactLayout } =
    useAppSelector(selectSettings);

  const changeSetting = <T extends keyof SettingsState>(
    key: T,
    value: SettingsState[T]
  ) => dispatch(settingsActions.changeSetting({ [key]: value }));

  const { width } = useWindowSize();
  const isCompactMenu = width < COMPACT_MENU_BREAKPOINT && compactLayout;
  const isSeparateButton = width < SEPARATE_BUTTON_BREAKPOINT && compactLayout;

  return (
    <Group position="apart" sx={{ flexWrap: "nowrap" }}>
      <Group>
        <Select
          value={selectedStage}
          onChange={(v) => changeSetting("selectedStage", v as JOStages)}
          data={Object.entries(JOINT_OPS_NAMES).map(
            ([stage, [name, short_name]]) => ({
              value: stage,
              label: isCompactMenu ? short_name : name,
            })
          )}
          transition="fade"
          transitionDuration={120}
          sx={{
            width: isCompactMenu ? 80 : 220,
            transition: "width .3s ease-in-out",
          }}
        />

        <Button
          onClick={() =>
            dispatch(
              stateActions.openChest({ stage: selectedStage, chipEnabled })
            )
          }
          sx={
            isSeparateButton
              ? {
                  position: "fixed",
                  bottom: 20,
                  left: 20,
                  right: 20,
                }
              : undefined
          }
        >
          {isCompactMenu ? "Chest" : "Chest opened"}
        </Button>
        <Switch
          label={isCompactMenu ? "JO-Chip" : "JO-Chip enabled"}
          checked={chipEnabled}
          onChange={(e) =>
            changeSetting("chipEnabled", e.currentTarget.checked)
          }
        />
      </Group>

      <SettingsMenu />
    </Group>
  );
};
