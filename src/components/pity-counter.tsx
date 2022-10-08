import { Stack } from "@mantine/core";
import { FC } from "react";
import { ActionsMenu } from "./actions-menu";
import { OutputTable } from "./output-table";

export const PityCounter: FC = () => {
  return (
    <Stack>
      <ActionsMenu />
      <OutputTable />
    </Stack>
  );
};
