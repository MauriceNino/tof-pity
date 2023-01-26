import { Text, Tooltip, useMantineTheme } from '@mantine/core';
import { FC } from 'react';

import { JOINT_OPS_RATES } from '../constants/joint-ops';
import { usePity } from '../hooks';
import { selectSettings } from '../redux/settingsSlice';
import { useAppSelector } from '../redux/store';
import { JODrops } from '../types/joint-ops';

export const CurrentPityOutput: FC<{
  opacityChangeClass: string;
  item: JODrops;
}> = ({ opacityChangeClass, item }) => {
  const { selectedStage, countChestAsOnePity } = useAppSelector(selectSettings);

  const { colors } = useMantineTheme();

  const { pity, carryOver, dropped } = usePity(selectedStage, item);

  const { specialFall } = JOINT_OPS_RATES[selectedStage][item];
  const currentPity = (pity - carryOver) * (countChestAsOnePity ? 2 : 1);

  if (specialFall) {
    const sfrs =
      (specialFall.rangeStart - carryOver) * (countChestAsOnePity ? 2 : 1);
    const sfre =
      (specialFall.rangeEnd - carryOver) * (countChestAsOnePity ? 2 : 1);

    return (
      <Tooltip
        multiline
        width={550}
        withArrow
        position='bottom'
        transition='fade'
        label={
          <Text>
            The pity can only be assumed and not exactly calculated.
            <br />
            However, if you have logged many runs/chests, we can pretty
            accurately determine the current pity chain.
            <br />
            <br />-{' '}
            <Text span color={colors.red[4]}>
              Red
            </Text>
            : No drops yet - we can only assume that the next pity will happen
            at the maximum pity range
            <br />-{' '}
            <Text span color={colors.yellow[4]}>
              Yellow
            </Text>
            : Only one drop yet - we are not sure if this was off-pity yet
          </Text>
        }
      >
        <span>
          <Text span weight='bold'>
            {currentPity}
          </Text>
          <Text
            span
            className={opacityChangeClass}
            style={{
              color:
                dropped <= 1
                  ? colors.red[4]
                  : dropped <= 2
                  ? colors.yellow[4]
                  : undefined,
            }}
          >
            {' '}
            / {specialFall.initial === -1 ? '?' : `${sfrs} - ${sfre}`}
          </Text>
        </span>
      </Tooltip>
    );
  }

  return <>{currentPity}</>;
};
