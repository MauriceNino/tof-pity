import {
  Button,
  Checkbox,
  createStyles,
  Table,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { FC } from 'react';

import {
  DROPS_NAMES,
  isNoChance,
  JOINT_OPS_RATES,
} from '../constants/joint-ops';
import { useDropTableOrder, useWindowSize } from '../hooks';
import { selectSettings } from '../redux/settingsSlice';
import { selectState, stateActions } from '../redux/stateSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { JODrops, PerChestRates } from '../types/joint-ops';
import { itemToColor } from '../util/util';

const CHEST_SHOW_BREAKPOINT = 640;

const getDropsChance = (
  rates: PerChestRates,
  chest: 0 | 1 | 2,
  currentPity = 0
) => {
  if (rates.chests[chest] === -1) {
    return '? %';
  }

  const isSpecialFall =
    rates.specialFall && currentPity >= rates.specialFall.start;

  const rate =
    rates.chests[chest] + (isSpecialFall ? rates.specialFall!.rate : 0);

  return `${rate.toFixed(1)}%`;
};

const useStyles = createStyles((t, _, getRef) => ({
  tableRow: {
    [`&:hover .${getRef('opacity-change')}`]: {
      opacity: 1,
    },
    [`.${getRef('opacity-change')}`]: {
      opacity: 0.5,
      transition: 'all .1s ease-in-out',
    },
  },
  opacityChange: {
    ref: getRef('opacity-change'),
  },
}));

export const TableRow: FC<{ item: JODrops }> = ({ item }) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectState);
  const { selectedStage, compactLayout } = useAppSelector(selectSettings);

  const { width } = useWindowSize();
  const isCompactTable = width < CHEST_SHOW_BREAKPOINT && compactLayout;
  const { colors } = useMantineTheme();
  const { classes } = useStyles();

  const rates = JOINT_OPS_RATES[selectedStage][item];
  const counts = state.joCounts[selectedStage]?.counts?.[item];
  const currentPity = counts?.currentPity ?? 0;

  const doubleDrop = state.doubleDrop[selectedStage]?.[item];

  return (
    <motion.tr
      key={item}
      layoutId={item}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={classes.tableRow}
    >
      <td
        className={classes.opacityChange}
        style={{
          color: itemToColor(colors, item),
        }}
      >
        {DROPS_NAMES[item]}
      </td>
      {!isCompactTable && (
        <>
          <td className={classes.opacityChange}>
            {getDropsChance(rates, 0, counts?.currentPity)}
          </td>
          <td className={classes.opacityChange}>
            {getDropsChance(rates, 1, counts?.currentPity)}
          </td>
          <td className={classes.opacityChange}>
            {getDropsChance(rates, 2, counts?.currentPity)}
          </td>
        </>
      )}
      <td>
        {rates.specialFall ? (
          <>
            <Text span weight='bold'>
              {currentPity}
            </Text>
            <Text span className={classes.opacityChange}>
              {' '}
              / {rates.specialFall.end === -1 ? '?' : rates.specialFall.end + 1}
            </Text>
          </>
        ) : (
          currentPity
        )}
      </td>
      <td>
        <Checkbox
          style={{ marginLeft: '25%' }}
          checked={doubleDrop}
          onChange={() =>
            dispatch(
              stateActions.flipDoubleDrop({
                stage: selectedStage,
                item,
              })
            )
          }
        />
      </td>
      <td>
        <Tooltip
          multiline
          width={350}
          withArrow
          position='left'
          transition='fade'
          label={
            'If your chest dropped the item, click this button to indicate a drop. If you have gotten two drops, you can click the button twice.'
          }
        >
          <Button
            variant={currentPity === 0 ? 'subtle' : 'light'}
            onClick={() =>
              dispatch(
                stateActions.registerDrop({
                  drop: item,
                  selectedStage,
                })
              )
            }
            sx={{
              '&[data-disabled]': { color: colors.gray[6] },
            }}
          >
            Drop
          </Button>
        </Tooltip>
      </td>
    </motion.tr>
  );
};

const TABLE_HEADINGS = [
  { text: '' },
  {
    text: 'Chest #1',
    description: 'Chance of pulling the item on the next chest.',
  },
  {
    text: 'Chest #2',
    description: 'Chance of pulling the item on the next chest.',
  },
  {
    text: 'Chest #3',
    description: 'Chance of pulling the item on the next chest.',
  },
  {
    text: 'Pity',
    description:
      'The current pity for this item compared to the expected max pity where a guaranteed drop will happen.',
  },
  {
    text: 'Double Drop',
    description:
      'When there is a double drop event for this item, please check this box. Normally this will automatically check itself, if there is an event going on.',
  },
  {
    text: '',
  },
];

export const OutputTable: FC = () => {
  const { selectedStage, compactLayout } = useAppSelector(selectSettings);
  const dropTableOrder = useDropTableOrder();
  const { width } = useWindowSize();
  const isCompactTable = width < CHEST_SHOW_BREAKPOINT && compactLayout;

  const headings = TABLE_HEADINGS.filter(
    (_, i) => !isCompactTable || [0, 4, 5, 6].includes(i)
  );

  return (
    <Table>
      <LayoutGroup>
        <thead>
          <tr>
            <AnimatePresence>
              {headings.map((h, i) => (
                <motion.th key={`heading_${i}`} layout>
                  {h.description ? (
                    <Tooltip
                      multiline
                      width={280}
                      withArrow
                      position='bottom'
                      transition='fade'
                      label={h.description}
                    >
                      <span>{h.text}</span>
                    </Tooltip>
                  ) : (
                    h.text
                  )}
                </motion.th>
              ))}
            </AnimatePresence>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {dropTableOrder
              .filter(t => !isNoChance(selectedStage, t))
              .map(t => (
                <TableRow key={t} item={t} />
              ))}
          </AnimatePresence>
        </tbody>
      </LayoutGroup>
    </Table>
  );
};
