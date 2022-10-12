import { Button, Modal, Stack, Text, useMantineTheme } from "@mantine/core";
import { FC } from "react";

export const ConfirmModal: FC<{
  opened: boolean;
  close: () => void;
  onConfirm: () => void;
  title: string;
  text: string;
  yesText: string;
  noText: string;
  danger?: boolean;
}> = ({ opened, close, onConfirm, title, text, yesText, noText, danger }) => {
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
      title={title}
    >
      <Stack>
        <Text weight="bold">{text}</Text>

        <Stack spacing="xs">
          <Button
            color={danger ? "red.5" : undefined}
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            {yesText}
          </Button>
          <Button variant="subtle" onClick={() => close()}>
            {noText}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
