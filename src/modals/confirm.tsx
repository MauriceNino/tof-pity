import { Button, Modal, Stack, Text, useMantineTheme } from "@mantine/core";
import { FC } from "react";

export const ConfirmModal: FC<{
  opened: boolean;
  close: () => void;
  onConfirm: () => void;
}> = ({ opened, close, onConfirm }) => {
  const { colors } = useMantineTheme();

  return (
    <Modal
      size="sm"
      radius="lg"
      styles={{
        modal: {
          backgroundColor: colors.dark[5],
        },
      }}
      opened={opened}
      onClose={close}
      title="Are you sure?"
    >
      <Stack>
        <Text weight="bold">
          This operation can not be reversed and all history will be deleted
        </Text>

        <Stack spacing="xs">
          <Button
            color="red.5"
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            Yes, clear my history
          </Button>
          <Button variant="subtle" onClick={() => close()}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
