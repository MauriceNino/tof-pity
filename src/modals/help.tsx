import { Box, List, Modal, Stack, Text, useMantineTheme } from '@mantine/core';
import { FC } from 'react';

export const HelpModal: FC<{ opened: boolean; close: () => void }> = ({
  opened,
  close,
}) => {
  const { colors } = useMantineTheme();

  return (
    <Modal
      size='lg'
      radius='lg'
      styles={{
        modal: {
          backgroundColor: colors.dark[5],
        },
      }}
      opened={opened}
      onClose={close}
      title='Help'
    >
      <Stack>
        <Box>
          <Text weight='bold'>What is this project for?</Text>

          <Stack spacing='xs'>
            <Text size='sm'>
              In the game Tower of Fantasy, there are instances called Joint
              Operations, which offer rewards for specific rates, as well as a
              guaranteed reward after a set number of opened chests.
            </Text>
            <Text size='sm'>
              To optimize the rewards that you get, you should count how many
              more chests are needed for a specific pity (e.g. Gold Matrix) and
              then use that on the instance of your choice.
            </Text>
          </Stack>
        </Box>

        <Box>
          <Text weight='bold'>How do I use this site?</Text>
          <List size='sm'>
            <List.Item>
              Select the instance you are currently running (pity does not
              share)
            </List.Item>
            <List.Item>
              Whenever you open a chest, click the button to increase the pity
              counter
            </List.Item>
            <List.Item>
              When you dropped the desired reward, click the Drop button next to
              it
            </List.Item>
          </List>
        </Box>

        <Box>
          <Text weight='bold'>What data is this based on?</Text>
          <Text size='sm'>
            All the data is based on{' '}
            <Text
              component='a'
              href='https://twitter.com/Sova_ToF/status/1565048068252344326'
              target='_blank'
              color='blue'
            >
              this tweet
            </Text>
            .
          </Text>
        </Box>

        <Box>
          <Text weight='bold'>
            Why does the pity for matrix only go up 0.5 per chest?
          </Text>
          <Text size='sm'>
            The current data suggests, that every chest gives 0.5 pity for every
            possible drop. Joint Ops chips double that pity increase for all
            armor type items, which is why they are increased by 1 on each
            chest, if enabled. Unfortunately matrix pity is not affected by
            JO-Chips, which is why they only go up 0.5, no matter what.
            <br />
            This also means, that the actual pity for SSR matrix is at 68
            chests, not 34!
          </Text>
        </Box>
      </Stack>
    </Modal>
  );
};
