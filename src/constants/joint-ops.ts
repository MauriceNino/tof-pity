import {
  GearTypes,
  JODrops,
  JOStages,
  MatrixTypes,
  PerChestRates,
  PerItemRates,
  SharedDropPools,
} from '../types/joint-ops';

const buildRates = (
  c1: number,
  c2: number,
  c3: number,
  sfs?: number,
  sfe?: number,
  sfr?: number,
  dropPool?: SharedDropPools
): PerChestRates => ({
  chests: [c1, c2, c3],
  specialFall:
    sfs != null && sfe != null && sfr != null
      ? {
          start: sfs,
          end: sfe,
          rate: sfr,
        }
      : undefined,
  dropPool,
});

const NO_CHANCE = buildRates(0, 0, 0);
export const isNoChance = (stage: JOStages, item: JODrops) =>
  JOINT_OPS_RATES[stage][item].chests.every(c => c === 0);

export const JOINT_OPS_RATES: Record<JOStages, PerItemRates> = {
  [JOStages.I]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: NO_CHANCE,
    [GearTypes.Gold]: NO_CHANCE,
    [MatrixTypes.Blue]: buildRates(100, 100, 100),
    [MatrixTypes.Green]: buildRates(100, 100, 100),
    [MatrixTypes.Purple]: NO_CHANCE,
    [MatrixTypes.Gold]: NO_CHANCE,
  },
  [JOStages.II]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: NO_CHANCE,
    [GearTypes.Gold]: NO_CHANCE,
    [MatrixTypes.Blue]: buildRates(100, 100, 100),
    [MatrixTypes.Green]: buildRates(100, 100, 100),
    [MatrixTypes.Purple]: NO_CHANCE,
    [MatrixTypes.Gold]: NO_CHANCE,
  },
  [JOStages.III]: {
    [GearTypes.Blue]: buildRates(50, 50, 50),
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: NO_CHANCE,
    [GearTypes.Gold]: NO_CHANCE,
    [MatrixTypes.Blue]: buildRates(100, 100, 100),
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(4.75, 4.75, 4.75),
    [MatrixTypes.Gold]: NO_CHANCE,
  },
  [JOStages.IV]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(0.61, 1.11, 2.36, 2, 11, 4.13),
    [GearTypes.Gold]: NO_CHANCE,
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(0, 0.66, 2.33, 2, 7, 6.33),
    [MatrixTypes.Gold]: NO_CHANCE,
  },
  [JOStages.V]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(1.23, 2.23, 4.73, 1, 5, 8.26),
    [GearTypes.Gold]: NO_CHANCE,
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(0, 0.66, 2.33, 2, 7, 6.33),
    [MatrixTypes.Gold]: buildRates(0, 0.1, 0.35, 11, 47, 0.95),
  },
  [JOStages.VI]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(2.47, 4.47, 9.47, 1, 2, 16.52),
    [GearTypes.Gold]: buildRates(0.61, 1.11, 2.36, 2, 11, 4.13),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(0, 0.66, 2.33, 2, 7, 6.33),
    [MatrixTypes.Gold]: buildRates(0, 0.12, 0.42, 9, 39, 1.14),
  },
  [JOStages.VII]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(2.89, 5.22, 11.05, 1, 2, 19.27),
    [GearTypes.Gold]: buildRates(1.23, 2.23, 4.73, 1, 5, 8.26),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(0, 0.66, 2.33, 2, 7, 6.33),
    [MatrixTypes.Gold]: buildRates(0, 0.14, 0.49, 8, 33, 1.33),
  },
  [JOStages.VIII]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(3.3, 5.97, 12.63, 0, 2, 22.02),
    [GearTypes.Gold]: buildRates(1.85, 3.35, 7.1, 1, 3, 12.39),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(
      0,
      0.66,
      2.33,
      2,
      7,
      6.33,
      SharedDropPools.PURPLE_MATRIX_SHARED_8_TO_12
    ),
    [MatrixTypes.Gold]: buildRates(
      0,
      0.14,
      0.49,
      8,
      33,
      1.33,
      SharedDropPools.GOLD_MATRIX_SHARED_8_TO_12
    ),
  },
  [JOStages.HARD_I]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(26.66, 26.66, 26.66),
    [GearTypes.Gold]: buildRates(1.85, 3.35, 7.1, 1, 3, 12.39),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(
      0,
      0.66,
      2.33,
      2,
      7,
      6.33,
      SharedDropPools.PURPLE_MATRIX_SHARED_8_TO_12
    ),
    [MatrixTypes.Gold]: buildRates(
      0,
      0.14,
      0.49,
      8,
      33,
      1.33,
      SharedDropPools.GOLD_MATRIX_SHARED_8_TO_12
    ),
  },
  [JOStages.HARD_II]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(33.33, 33.33, 33.33),
    [GearTypes.Gold]: buildRates(2.27, 4.1, 8.68, 1, 3, 15.14),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(
      0,
      0.66,
      2.33,
      2,
      7,
      6.33,
      SharedDropPools.PURPLE_MATRIX_SHARED_8_TO_12
    ),
    [MatrixTypes.Gold]: buildRates(
      0,
      0.14,
      0.49,
      8,
      33,
      1.33,
      SharedDropPools.GOLD_MATRIX_SHARED_8_TO_12
    ),
  },
  [JOStages.HARD_II]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(33.33, 33.33, 33.33),
    [GearTypes.Gold]: buildRates(2.27, 4.1, 8.68, 1, 3, 15.14),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(
      0,
      0.66,
      2.33,
      2,
      7,
      6.33,
      SharedDropPools.PURPLE_MATRIX_SHARED_8_TO_12
    ),
    [MatrixTypes.Gold]: buildRates(
      0,
      0.14,
      0.49,
      8,
      33,
      1.33,
      SharedDropPools.GOLD_MATRIX_SHARED_8_TO_12
    ),
  },
  [JOStages.HARD_IV]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(-1, -1, -1),
    [GearTypes.Gold]: buildRates(-1, -1, -1),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(
      -1,
      -1,
      -1,
      undefined,
      undefined,
      undefined,
      SharedDropPools.PURPLE_MATRIX_SHARED_8_TO_12
    ),
    [MatrixTypes.Gold]: buildRates(
      -1,
      -1,
      -1,
      undefined,
      undefined,
      undefined,
      SharedDropPools.GOLD_MATRIX_SHARED_8_TO_12
    ),
  },
  [JOStages.HARD_III]: {
    [GearTypes.Blue]: NO_CHANCE,
    [GearTypes.Green]: NO_CHANCE,
    [GearTypes.Purple]: buildRates(-1, -1, -1),
    [GearTypes.Gold]: buildRates(-1, -1, -1),
    [MatrixTypes.Blue]: NO_CHANCE,
    [MatrixTypes.Green]: NO_CHANCE,
    [MatrixTypes.Purple]: buildRates(
      -1,
      -1,
      -1,
      undefined,
      undefined,
      undefined,
      SharedDropPools.PURPLE_MATRIX_SHARED_8_TO_12
    ),
    [MatrixTypes.Gold]: buildRates(
      -1,
      -1,
      -1,
      undefined,
      undefined,
      undefined,
      SharedDropPools.GOLD_MATRIX_SHARED_8_TO_12
    ),
  },
};

export const JOINT_OPS_NAMES: Record<JOStages, [string, string]> = {
  [JOStages.I]: ['Joint Operation I (Lv. 20)', 'I'],
  [JOStages.II]: ['Joint Operation II (Lv. 25)', 'II'],
  [JOStages.III]: ['Joint Operation III (Lv. 31)', 'III'],
  [JOStages.IV]: ['Joint Operation IV (Lv. 37)', 'IV'],
  [JOStages.V]: ['Joint Operation V (Lv. 43)', 'V'],
  [JOStages.VI]: ['Joint Operation VI (Lv. 50)', 'VI'],
  [JOStages.VII]: ['Joint Operation VII (Lv. 60)', 'VII'],
  [JOStages.VIII]: ['Joint Operation VIII (Lv. 70)', 'VIII'],
  [JOStages.HARD_I]: ['Joint Operation VERA I (Lv. 75)', 'VERA I'],
  [JOStages.HARD_II]: ['Joint Operation VERA II (Lv. 80)', 'VERA II'],
  [JOStages.HARD_III]: ['Joint Operation VERA III (Lv. ?)', 'VERA III'],
  [JOStages.HARD_IV]: ['Joint Operation VERA IV (Lv. ?)', 'VERA IV'],
};

export const DROPS_NAMES: Record<JODrops, string> = {
  [GearTypes.Blue]: 'Blue Armor',
  [GearTypes.Green]: 'Green Armor',
  [GearTypes.Purple]: 'Purple Armor',
  [GearTypes.Gold]: 'Gold Armor',
  [MatrixTypes.Blue]: 'Blue Matrix',
  [MatrixTypes.Green]: 'Green Matrix',
  [MatrixTypes.Purple]: 'Purple Matrix',
  [MatrixTypes.Gold]: 'Gold Matrix',
};

export const SUPPLY_CHIP_BEHAVIOR: Record<
  JODrops,
  { withChip: number; withoutChip: number }
> = {
  [GearTypes.Blue]: { withChip: 1, withoutChip: 0.5 },
  [GearTypes.Green]: { withChip: 1, withoutChip: 0.5 },
  [GearTypes.Purple]: { withChip: 1, withoutChip: 0.5 },
  [GearTypes.Gold]: { withChip: 1, withoutChip: 0.5 },
  [MatrixTypes.Blue]: { withChip: 0.5, withoutChip: 0.5 },
  [MatrixTypes.Green]: { withChip: 0.5, withoutChip: 0.5 },
  [MatrixTypes.Purple]: { withChip: 0.5, withoutChip: 0.5 },
  [MatrixTypes.Gold]: { withChip: 0.5, withoutChip: 0.5 },
};
