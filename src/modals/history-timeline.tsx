import { Text, ThemeIcon, Timeline, useMantineTheme } from '@mantine/core';
import { IconCheck } from '@tabler/icons';
import moment from 'moment';
import { FC, Fragment, useMemo, useState } from 'react';

import { RemovableText } from '../components/removable-text';
import { DROPS_NAMES, JOINT_OPS_NAMES } from '../constants/joint-ops';
import {
  historyIsChestOpen,
  historyIsItemDrop,
  selectState,
  stateActions,
} from '../redux/stateSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { JODrops, JOStages } from '../types/joint-ops';
import { getStagesForPool, itemToColor, last, lastIndex } from '../util/util';
import { ConfirmModal } from './confirm';

const timeStr = (ts: number) => {
  return moment(ts).fromNow();
};

export const HistoryTimeline: FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectState);

  const [confirmOpened, setConfirmOpened] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState<number>(-1);
  const { colors } = useMantineTheme();

  const historyReduced = useMemo(
    () =>
      state.changeHistory
        .reduce(
          (acc, curr, i) => {
            if (historyIsChestOpen(curr)) {
              acc.push({
                index: i,
                ts: curr.ts,
                stage: curr.stage,
                drops: [],
              });
            }

            if (historyIsItemDrop(curr)) {
              const stages = curr.dropPool
                ? getStagesForPool(curr.dropPool)
                : [curr.stage];

              const lastChestOpen = last(acc, el => el.stage === curr.stage);
              const lastDrop = lastIndex(
                acc,
                el =>
                  stages.includes(el.stage) &&
                  el.drops.some(d => d.item === curr.item)
              );
              const sinceLastDrop =
                acc
                  .slice(lastDrop === -1 ? 0 : lastDrop)
                  .filter(el => stages.includes(el.stage)).length -
                (lastDrop === -1 ? 0 : 1);

              if (lastChestOpen != null) {
                lastChestOpen.drops.push({
                  item: curr.item,
                  index: i,
                  onChest: sinceLastDrop,
                });
              } else {
                acc.push({
                  index: i,
                  ts: undefined,
                  stage: curr.stage,
                  drops: [
                    {
                      item: curr.item,
                      index: i,
                      onChest: sinceLastDrop,
                    },
                  ],
                });
              }
            }

            return acc;
          },
          [] as {
            index: number;
            ts?: number;
            stage: JOStages;
            drops: {
              item: JODrops;
              index: number;
              onChest: number;
            }[];
          }[]
        )
        .reverse(),
    [state.changeHistory]
  );

  return (
    <>
      <Timeline bulletSize={24} lineWidth={2}>
        {historyReduced.map((his, i) => (
          <Timeline.Item
            key={i}
            title={`Chest Opened - ${JOINT_OPS_NAMES[his.stage][0]}`}
            bullet={
              his.drops.length > 0 ? (
                <ThemeIcon
                  size={22}
                  variant='filled'
                  color={itemToColor(colors, his.drops[0].item)}
                  radius='xl'
                >
                  <IconCheck color={colors.gray[8]} size={14} />
                </ThemeIcon>
              ) : undefined
            }
          >
            {his.drops.length > 0 && (
              <Text color='dimmed' size='sm'>
                Drops:{' '}
                {his.drops.map(({ item, index, onChest }, i) => (
                  <Fragment key={item + i}>
                    <RemovableText
                      color={itemToColor(colors, item)}
                      text={`${DROPS_NAMES[item]} [Chest ${onChest}]`}
                      onRemove={() => {
                        setConfirmOpened(true);
                        setIndexToRemove(index);
                      }}
                    />
                    {i + 1 < his.drops.length && <Text span>, </Text>}
                  </Fragment>
                ))}
              </Text>
            )}
            {his.ts && (
              <Text color='dimmed' size='sm'>
                {timeStr(his.ts)}
              </Text>
            )}
          </Timeline.Item>
        ))}
      </Timeline>

      <ConfirmModal
        opened={confirmOpened}
        close={() => setConfirmOpened(false)}
        onConfirm={() =>
          dispatch(stateActions.removeSpecificHistory(indexToRemove))
        }
        title='Are you sure?'
        text='This operation can not be reversed and the drop will be deleted from the history.'
        yesText='Yes'
        noText='Cancel'
        danger
      />
    </>
  );
};
