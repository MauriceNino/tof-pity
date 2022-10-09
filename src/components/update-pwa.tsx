import { Button, Dialog, Group, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export const UpdatePwa = () => {
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW: (_, r) => {
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError: (error) => {
      console.error("SW registration error", error);
    },
  });

  useEffect(() => {
    setOpened(needRefresh);
  }, [needRefresh]);

  return (
    <Dialog opened={opened} radius="md" sx={{ width: "unset" }}>
      <Stack>
        <Text>Application update available!</Text>

        <Group>
          <Button
            loading={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await updateServiceWorker(true);
                setOpened(false);
              } finally {
                setLoading(false);
              }
            }}
          >
            Update
          </Button>
          <Button
            variant="subtle"
            color="red.6"
            onClick={() => {
              setNeedRefresh(false);
              setOpened(false);
            }}
          >
            Ignore
          </Button>
        </Group>
      </Stack>
    </Dialog>
  );
};
