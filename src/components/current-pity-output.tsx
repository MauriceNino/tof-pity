import { Text } from '@mantine/core';
import { FC } from 'react';

import { JOINT_OPS_RATES } from '../constants/joint-ops';
import { selectSettings } from '../redux/settingsSlice';
import { selectState } from '../redux/stateSlice';
import { useAppSelector } from '../redux/store';
import { JODrops } from '../types/joint-ops';

export const CurrentPityOutput: FC<{
  opacityChangeClass: string;
  item: JODrops;
}> = ({ opacityChangeClass, item }) => {
  const state = useAppSelector(selectState);
  const { selectedStage, countChestAsOnePity } = useAppSelector(selectSettings);

  const rates = JOINT_OPS_RATES[selectedStage][item];
  const counts = state.joCounts[selectedStage]?.counts?.[item];
  const currentPity =
    (counts?.currentPity ?? 0) * (countChestAsOnePity ? 2 : 1);

  if (rates.specialFall) {
    const sfrs = rates.specialFall.rangeStart * (countChestAsOnePity ? 2 : 1);
    const sfre = rates.specialFall.rangeEnd * (countChestAsOnePity ? 2 : 1);

    return (
      <>
        <Text span weight='bold'>
          {currentPity}
        </Text>
        <Text span className={opacityChangeClass}>
          {' '}
          / {rates.specialFall.initial === -1 ? '?' : `${sfrs} - ${sfre}`}
        </Text>
      </>
    );
  }

  return <>{currentPity}</>;
};
