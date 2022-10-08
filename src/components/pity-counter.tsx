import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowBackUp, IconBrandGithub, IconSettings } from "@tabler/icons";
import { FC, useState } from "react";
import {
  DROPS_NAMES,
  isNoChance,
  JOINT_OPS_NAMES,
  JOINT_OPS_RATES,
} from "../constants/joint-ops";
import { selectState, stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  GearTypes,
  JOStages,
  MatrixTypes,
  PerChestRates,
} from "../types/joint-ops";

const DROP_TABLE_ORDER = [
  GearTypes.Gold,
  MatrixTypes.Gold,
  GearTypes.Purple,
  MatrixTypes.Purple,
  GearTypes.Blue,
  MatrixTypes.Blue,
  GearTypes.Green,
  MatrixTypes.Green,
];

const getDropsChance = (
  rates: PerChestRates,
  chest: 0 | 1 | 2,
  currentPity = 0
) => {
  const isSpecialFall =
    rates.specialFall && currentPity >= rates.specialFall.start;

  const rate =
    rates.chests[chest] + (isSpecialFall ? rates.specialFall!.rate : 0);

  return `${rate.toFixed(1)}%`;
};

export const PityCounter: FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectState);

  const [selectedStage, setSelectedStage] = useState(JOStages.VII);
  const [chipEnabled, setChipEnabled] = useState(true);

  const { colors } = useMantineTheme();

  return (
    <Stack>
      <Group position="apart" sx={{ flexWrap: "nowrap" }}>
        <Group sx={{ alignItems: "flex-end" }}>
          <Select
            value={selectedStage}
            onChange={(v) => setSelectedStage(v as JOStages)}
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
              onChange={(e) => setChipEnabled(e.currentTarget.checked)}
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

      <Group>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>Chest #1</th>
              <th>Chest #2</th>
              <th>Chest #3</th>
              <th>Current Pity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {DROP_TABLE_ORDER.filter((v) => !isNoChance(selectedStage, v)).map(
              (type) => {
                const rates = JOINT_OPS_RATES[selectedStage][type];
                const counts = state.joCounts[selectedStage]?.counts?.[type];
                const currentPity = counts?.currentPity ?? 0;

                return (
                  <tr key={type}>
                    <td
                      style={{
                        color: [GearTypes.Gold, MatrixTypes.Gold].includes(type)
                          ? colors["gold-items"][0]
                          : [GearTypes.Purple, MatrixTypes.Purple].includes(
                              type
                            )
                          ? colors["purple-items"][0]
                          : [GearTypes.Blue, MatrixTypes.Blue].includes(type)
                          ? colors["blue-items"][0]
                          : colors["green-items"][0],
                      }}
                    >
                      {DROPS_NAMES[type]}
                    </td>
                    <td>{getDropsChance(rates, 0, counts?.currentPity)}</td>
                    <td>{getDropsChance(rates, 1, counts?.currentPity)}</td>
                    <td>{getDropsChance(rates, 2, counts?.currentPity)}</td>
                    <td>
                      {rates.specialFall ? (
                        <Text>
                          <Text span weight="bold">
                            {currentPity}
                          </Text>{" "}
                          / {rates.specialFall.end}
                        </Text>
                      ) : (
                        currentPity
                      )}
                    </td>
                    <td>
                      <Button
                        variant="light"
                        onClick={() =>
                          dispatch(
                            stateActions.registerDrop({
                              stage: selectedStage,
                              type,
                            })
                          )
                        }
                      >
                        Drop
                      </Button>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      </Group>
    </Stack>
  );
};
