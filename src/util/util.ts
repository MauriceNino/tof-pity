import { MantineTheme } from '@mantine/core';
import { WritableDraft } from 'immer/dist/internal';

import { JOINT_OPS_RATES, SUPPLY_CHIP_BEHAVIOR } from '../constants/joint-ops';
import { State } from '../redux/stateSlice';
import {
  GearTypes,
  JODrops,
  JOStages,
  MatrixTypes,
  PerChestRates,
  PerItemCount,
  SharedDropPools,
} from '../types/joint-ops';

export const itemToColor = (colors: MantineTheme['colors'], item: JODrops) => {
  return [GearTypes.Gold, MatrixTypes.Gold].includes(item)
    ? colors['gold-items'][0]
    : [GearTypes.Purple, MatrixTypes.Purple].includes(item)
    ? colors['purple-items'][0]
    : [GearTypes.Blue, MatrixTypes.Blue].includes(item)
    ? colors['blue-items'][0]
    : colors['green-items'][0];
};

export const lastIndex = <T>(arr: T[], matcher: (el: T) => boolean): number =>
  arr.map(el => matcher(el)).lastIndexOf(true);

export const last = <T>(arr: T[], matcher: (el: T) => boolean): T | undefined =>
  arr[lastIndex(arr, matcher)];

export const getPity = (
  type: JODrops,
  chipEnabled: boolean,
  doubleDrop?: boolean
) => {
  const behavior = SUPPLY_CHIP_BEHAVIOR[type];

  const base = chipEnabled ? behavior.withChip : behavior.withoutChip;
  const double = doubleDrop ? 0.5 : 0;

  return base + double;
};

export const getSharedPoolsForStage = (stage: JOStages) => {
  return Object.entries(JOINT_OPS_RATES[stage]).reduce(
    (acc, [item, { dropPool }]) => {
      if (dropPool != null) {
        acc.push({
          item: item as JODrops,
          dropPool,
        });
      }
      return acc;
    },
    [] as { item: JODrops; dropPool: SharedDropPools }[]
  );
};

export const getStagesForPool = (dropPool: SharedDropPools) => {
  return Object.entries(JOINT_OPS_RATES)
    .filter(([, items]) =>
      Object.values(items).some(rates => rates.dropPool === dropPool)
    )
    .map(([stage]) => stage as JOStages);
};

export const forEachPoolPity = (
  counts: State['joCounts'],
  fn: (pity: PerItemCount[JODrops], rates: PerChestRates) => void
) => {
  Object.entries(counts ?? {}).forEach(([stage, { counts }]) => {
    Object.entries(counts).forEach(([item, pity]) => {
      const rates = JOINT_OPS_RATES[stage as JOStages][item as JODrops];

      fn(pity, rates);
    });
  });
};

export const arrOrCreate = <T>(arr?: WritableDraft<T>[]) => {
  if (!arr) {
    arr = [] as WritableDraft<T>[];
  }

  return arr;
};

export const objOrCreate = <T extends object>(obj?: WritableDraft<T>) => {
  if (!obj) {
    obj = {} as WritableDraft<T>;
  }

  return obj;
};
