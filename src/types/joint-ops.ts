export enum GearTypes {
  Green = 'green_gear',
  Blue = 'blue_gear',
  Purple = 'purple_gear',
  Gold = 'gold_gear',
}

export enum MatrixTypes {
  Green = 'green_matrix',
  Blue = 'blue_matrix',
  Purple = 'purple_matrix',
  Gold = 'gold_matrix',
}

export enum JOStages {
  I = 'jo_stage_1',
  II = 'jo_stage_2',
  III = 'jo_stage_3',
  IV = 'jo_stage_4',
  V = 'jo_stage_5',
  VI = 'jo_stage_6',
  VII = 'jo_stage_7',
  VIII = 'jo_stage_8',
  HARD_I = 'jo_stage_hard_1',
  HARD_II = 'jo_stage_hard_2',
  HARD_III = 'jo_stage_hard_3',
  HARD_IV = 'jo_stage_hard_4',
}

export enum SharedDropPools {
  PURPLE_MATRIX_SHARED_8_TO_12 = 'purple_matrix_shared_8_to_12',
  GOLD_MATRIX_SHARED_8_TO_12 = 'gold_matrix_shared_8_to_12',
}

export type PerChestRates = {
  chests: [number, number, number];
  specialFall?: {
    start: number;
    end: number;
    rate: number;
  };
  dropPool?: SharedDropPools;
};

export type JODrops = GearTypes | MatrixTypes;
export type PerItemRates = Record<JODrops, PerChestRates>;
export type PerItemCount = Record<
  JODrops,
  {
    currentPity: number;
  }
>;
