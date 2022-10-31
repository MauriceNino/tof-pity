import { MantineTheme } from '@mantine/core';

import { GearTypes, JODrops, MatrixTypes } from '../types/joint-ops';

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
