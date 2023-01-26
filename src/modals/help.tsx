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
              When you dropped the desired reward, click the &quot;Drop&quot;
              button next to it
            </List.Item>
            <List.Item>
              Optional: When you get two drops in one chest, you can click the
              &quot;Drop&quot; button twice
            </List.Item>
          </List>
        </Box>

        <Box>
          <Text weight='bold'>What data is this based on?</Text>
          <Text size='sm'>
            All the data was initially based on{' '}
            <Text
              component='a'
              href='https://twitter.com/Sova_ToF/status/1565048068252344326'
              target='_blank'
              color='blue'
            >
              this tweet
            </Text>
            . And then later changed to fit the research of{' '}
            <Text
              component='a'
              href='https://lensdump.com/a/T3uAZ'
              target='_blank'
              color='blue'
            >
              this infographic
            </Text>
            .
          </Text>
        </Box>

        <Box>
          <Text weight='bold'>Why does the pity reset to weird numbers?</Text>
          <Text size='sm'>
            The program tries to detect when your next pity will happen. When it
            successfully establishes a pity chain, we can detect off-pity drops.
            <br />
            So if we do detect such an off-pity drop, we will still reset the
            counter to 0, but to make it more clear when the next pity will
            drop, we will also adjust the pity range accordingly.
          </Text>
        </Box>
      </Stack>
    </Modal>
  );
};
