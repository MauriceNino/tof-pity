import { Stack, Table, Text, useMantineTheme } from "@mantine/core";
import { FC } from "react";
import {
  DROPS_NAMES,
  isNoChance,
  JOINT_OPS_NAMES,
  JOINT_OPS_RATES,
  SUPPLY_CHIP_BEHAVIOR,
} from "../constants/joint-ops";
import { useDropTableOrder } from "../hooks";
import {
  historyIsChestOpen,
  historyIsItemDrop,
  selectState,
  State,
} from "../redux/stateSlice";
import { useAppSelector } from "../redux/store";
import { JODrops, JOStages } from "../types/joint-ops";
import { itemToColor } from "../util/util";

const isNoDrop = (
  history: State["changeHistory"],
  stage: JOStages,
  item: JODrops
) =>
  !history.some(
    (h) => historyIsItemDrop(h) && h.stage === stage && h.item === item
  );

export const HistoryStatistics: FC = () => {
  const { colors } = useMantineTheme();
  const state = useAppSelector(selectState);
  const dropTableOrder = useDropTableOrder();

  return (
    <Stack spacing="xl">
      {Object.entries(state.joCounts)
        .filter(
          ([stage]) =>
            state.changeHistory.filter((h) => h.stage === stage).length > 0
        )
        .map(([stage]) => (
          <Stack sx={{ gap: 0 }} key={stage}>
            <Stack sx={{ gap: 0 }}>
              <Text weight="bold" size="sm">
                {JOINT_OPS_NAMES[stage as JOStages][0]}
              </Text>
              <Text weight="bold" size="sm" color="dimmed">
                {
                  state.changeHistory.filter(
                    (h) => historyIsChestOpen(h) && h.stage === stage
                  ).length
                }{" "}
                Chests opened
              </Text>
            </Stack>

            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Drops</th>
                  <th>Average</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {dropTableOrder
                  .filter(
                    (drop) =>
                      !isNoChance(stage as JOStages, drop) &&
                      !isNoDrop(state.changeHistory, stage as JOStages, drop)
                  )
                  .map((drop) => {
                    const weightedOpened = state.changeHistory
                      .filter((h) => historyIsChestOpen(h) && h.stage === stage)
                      .reduce(
                        (acc, h) =>
                          acc +
                          (historyIsChestOpen(h)
                            ? h.withChip
                              ? SUPPLY_CHIP_BEHAVIOR[drop].withChip
                              : SUPPLY_CHIP_BEHAVIOR[drop].withoutChip
                            : 0),
                        0
                      );
                    const drops = state.changeHistory.filter(
                      (h) =>
                        historyIsItemDrop(h) &&
                        h.stage === stage &&
                        h.item === drop
                    ).length;

                    const rates = JOINT_OPS_RATES[stage as JOStages][drop];
                    const averageChest =
                      (rates.chests[0] + rates.chests[1] + rates.chests[2]) / 3;

                    let average = averageChest;

                    if (rates.specialFall) {
                      const pity = rates.specialFall.end + 1;
                      average =
                        average +
                        (rates.specialFall.rate *
                          (pity - rates.specialFall.start)) /
                          pity +
                        100 / pity;
                    }

                    const averageDrops = weightedOpened * (average / 100);
                    const diff = (drops / averageDrops) * 100 - 100;

                    return (
                      <tr key={drop}>
                        <td style={{ color: itemToColor(colors, drop) }}>
                          {DROPS_NAMES[drop]}
                        </td>
                        <td>{drops}</td>
                        <td>{averageDrops.toFixed(1)}</td>
                        <td
                          style={{
                            color:
                              diff >= 100 ? colors.green[3] : colors.red[3],
                          }}
                        >
                          {diff.toFixed(1)} %
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Stack>
        ))}
    </Stack>
  );
};
