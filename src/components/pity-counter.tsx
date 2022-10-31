import { Stack } from '@mantine/core';
import { FC } from 'react';

import { ActionsRow } from './actions-row';
import { OutputTable } from './output-table';
import { UpdatePwa } from './update-pwa';

export const PityCounter: FC = () => {
  return (
    <>
      <Stack>
        <ActionsRow />
        <OutputTable />
      </Stack>

      <UpdatePwa />
    </>
  );
};
