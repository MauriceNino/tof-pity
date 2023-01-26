import { Stack } from '@mantine/core';
import { FC } from 'react';

import { ActionsRow } from './actions-row';
import { OutputTable } from './output-table';

export const PityCounter: FC = () => {
  return (
    <Stack>
      <ActionsRow />
      <OutputTable />
    </Stack>
  );
};
