import { Text, ThemeIcon, Timeline, useMantineTheme } from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import moment from "moment";
import { FC, Fragment, useMemo } from "react";
import { DROPS_NAMES, JOINT_OPS_NAMES } from "../constants/joint-ops";
import {
  historyIsChestOpen,
  historyIsItemDrop,
  selectState,
} from "../redux/stateSlice";
import { useAppSelector } from "../redux/store";
import { JODrops, JOStages } from "../types/joint-ops";
import { itemToColor, last } from "../util/util";

const timeStr = (ts: number) => {
  return moment(ts).fromNow();
};

export const HistoryTimeline: FC = () => {
  const { colors } = useMantineTheme();
  const state = useAppSelector(selectState);

  const historyReduced = useMemo(
    () =>
      state.changeHistory
        .reduce(
          (acc, curr) => {
            if (historyIsChestOpen(curr)) {
              acc.push({
                ts: curr.ts,
                stage: curr.stage,
                drops: [],
              });
            }

            if (historyIsItemDrop(curr)) {
              const lastChestOpen = last(acc, (el) => el.stage === curr.stage);
              if (lastChestOpen != null) {
                lastChestOpen.drops.push(curr.item);
              } else {
                acc.push({
                  ts: undefined,
                  stage: curr.stage,
                  drops: [curr.item],
                });
              }
            }

            return acc;
          },
          [] as {
            ts?: number;
            stage: JOStages;
            drops: JODrops[];
          }[]
        )
        .reverse(),
    [state.changeHistory]
  );

  return (
    <Timeline bulletSize={24} lineWidth={2}>
      {historyReduced.map((his, i) => (
        <Timeline.Item
          key={i}
          title={`Chest Opened - ${JOINT_OPS_NAMES[his.stage][0]}`}
          bullet={
            his.drops.length > 0 ? (
              <ThemeIcon
                size={22}
                variant="filled"
                color={itemToColor(colors, his.drops[0])}
                radius="xl"
              >
                <IconCheck color={colors.gray[8]} size={14} />
              </ThemeIcon>
            ) : undefined
          }
        >
          {his.drops.length > 0 && (
            <Text color="dimmed" size="sm">
              Drops:{" "}
              {his.drops.map((drop, i) => (
                <Fragment key={drop + i}>
                  <Text
                    span
                    sx={{
                      color: itemToColor(colors, drop),
                    }}
                  >
                    {DROPS_NAMES[drop]}
                  </Text>
                  {i + 1 < his.drops.length && <Text span>, </Text>}
                </Fragment>
              ))}
            </Text>
          )}
          {his.ts && (
            <Text color="dimmed" size="sm">
              {timeStr(his.ts)}
            </Text>
          )}
        </Timeline.Item>
      ))}
    </Timeline>
  );
};
