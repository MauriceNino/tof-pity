import {
  Accordion,
  Button,
  FileButton,
  Group,
  Modal,
  Stack,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import {
  IconDatabaseExport,
  IconDatabaseImport,
  IconTrash,
} from '@tabler/icons';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';

import { selectState, stateActions } from '../redux/stateSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { ConfirmModal } from './confirm';
import { HistoryStatistics } from './history-statistics';
import { HistoryTimeline } from './history-timeline';

const downloadJSON = (filename: string, content: string) => {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' + encodeURIComponent(content)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString(16);
};

export const HistoryModal: FC<{ opened: boolean; close: () => void }> = ({
  opened,
  close,
}) => {
  const dispatch = useAppDispatch();
  const { colors } = useMantineTheme();
  const state = useAppSelector(selectState);

  const [confirmOpened, setConfirmOpened] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    const importState = async () => {
      if (importFile) {
        try {
          const fileContent = await importFile.text();
          const jsonContent = JSON.parse(fileContent);

          if (jsonContent.joCounts && jsonContent.changeHistory) {
            dispatch(stateActions.overrideState(jsonContent));
            setImportFile(null);
          } else {
            console.error('File does not match expectations');
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    importState();
  }, [importFile]);

  return (
    <>
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
        title={`History (${state.changeHistory.length})`}
      >
        <Stack>
          <Group>
            <FileButton onChange={setImportFile} accept='application/json'>
              {props => (
                <Tooltip
                  multiline
                  width={220}
                  withArrow
                  position='bottom'
                  transition='fade'
                  label='This will completely override the current state, including current pity counts!'
                >
                  <Button
                    {...props}
                    variant='subtle'
                    leftIcon={<IconDatabaseImport size={14} />}
                  >
                    Import
                  </Button>
                </Tooltip>
              )}
            </FileButton>
            <Button
              variant='subtle'
              leftIcon={<IconDatabaseExport size={14} />}
              onClick={() => {
                const json = JSON.stringify(state, undefined, 2);
                const dateStr = moment().valueOf();
                const hash = hashCode(json);
                downloadJSON(`tof_pity_export_${dateStr}_${hash}`, json);
              }}
            >
              Export
            </Button>
            <Tooltip
              multiline
              width={220}
              withArrow
              position='bottom'
              transition='fade'
              label='This will only clear the history! Pity counts will be left as is.'
            >
              <Button
                variant='subtle'
                color='red.5'
                leftIcon={<IconTrash size={14} />}
                onClick={() => setConfirmOpened(true)}
              >
                Clear
              </Button>
            </Tooltip>
          </Group>

          <Accordion defaultValue='statistics'>
            <Accordion.Item value='statistics'>
              <Accordion.Control>Statistics</Accordion.Control>
              <Accordion.Panel>
                <HistoryStatistics />
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='timeline'>
              <Accordion.Control disabled={state.changeHistory.length === 0}>
                Timeline
              </Accordion.Control>
              <Accordion.Panel>
                <HistoryTimeline />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Modal>

      <ConfirmModal
        opened={confirmOpened}
        close={() => setConfirmOpened(false)}
        onConfirm={() => dispatch(stateActions.clearHistory())}
        title='Are you sure?'
        text='This operation can not be reversed and all history will be deleted'
        yesText='Yes, clear my history'
        noText='Cancel'
        danger
      />
    </>
  );
};
