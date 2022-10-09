import {
  Button,
  createStyles,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { FC } from "react";
import {
  DROPS_NAMES,
  isNoChance,
  JOINT_OPS_RATES,
} from "../constants/joint-ops";
import { useWindowSize } from "../hooks";
import { selectSettings } from "../redux/settingsSlice";
import { selectState, stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  GearTypes,
  JODrops,
  MatrixTypes,
  PerChestRates,
} from "../types/joint-ops";

const CHEST_SHOW_BREAKPOINT = 565;

const getDropsChance = (
  rates: PerChestRates,
  chest: 0 | 1 | 2,
  currentPity = 0
) => {
  const isSpecialFall =
    rates.specialFall && currentPity >= rates.specialFall.start;

  const rate =
    rates.chests[chest] + (isSpecialFall ? rates.specialFall!.rate : 0);

  return `${rate.toFixed(1)}%`;
};

const useStyles = createStyles((t, _, getRef) => ({
  tableRow: {
    [`&:hover .${getRef("opacity-change")}`]: {
      opacity: 1,
    },
    [`.${getRef("opacity-change")}`]: {
      opacity: 0.5,
      transition: "all .1s ease-in-out",
    },
  },
  opacityChange: {
    ref: getRef("opacity-change"),
  },
}));

const getDropTableOrder = (
  goldEnabled: boolean,
  purpleEnabled: boolean,
  blueEnabled: boolean,
  greenEnabled: boolean
) => {
  const dropTable: JODrops[] = [];

  if (goldEnabled) dropTable.push(GearTypes.Gold, MatrixTypes.Gold);
  if (purpleEnabled) dropTable.push(GearTypes.Purple, MatrixTypes.Purple);
  if (blueEnabled) dropTable.push(GearTypes.Blue, MatrixTypes.Blue);
  if (greenEnabled) dropTable.push(GearTypes.Green, MatrixTypes.Green);

  return dropTable;
};

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
          color: [GearTypes.Gold, MatrixTypes.Gold].includes(item)
            ? colors["gold-items"][0]
            : [GearTypes.Purple, MatrixTypes.Purple].includes(item)
            ? colors["purple-items"][0]
            : [GearTypes.Blue, MatrixTypes.Blue].includes(item)
            ? colors["blue-items"][0]
            : colors["green-items"][0],
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
            <Text span weight="bold">
              {currentPity}
            </Text>
            <Text span className={classes.opacityChange}>
              {" "}
              / {rates.specialFall.end + 1}
            </Text>
          </>
        ) : (
          currentPity
        )}
      </td>
      <td>
        <Button
          variant="light"
          onClick={() =>
            dispatch(
              stateActions.registerDrop({
                stage: selectedStage,
                type: item,
              })
            )
          }
        >
          Drop
        </Button>
      </td>
    </motion.tr>
  );
};

const TABLE_HEADINGS = [
  "",
  "Chest #1",
  "Chest #2",
  "Chest #3",
  "Current Pity",
  "",
];

export const OutputTable: FC = () => {
  const {
    selectedStage,
    goldEnabled,
    purpleEnabled,
    blueEnabled,
    greenEnabled,
    compactLayout,
  } = useAppSelector(selectSettings);
  const { width } = useWindowSize();
  const isCompactTable = width < CHEST_SHOW_BREAKPOINT && compactLayout;

  const headings = TABLE_HEADINGS.map((h, i) => [h, i] as const).filter(
    ([_, i]) => !isCompactTable || [0, 4, 5].includes(i)
  );

  return (
    <Table>
      <LayoutGroup>
        <thead>
          <tr>
            <AnimatePresence>
              {headings.map(([h, i]) => (
                <motion.th key={i} layout>
                  {h}
                </motion.th>
              ))}
            </AnimatePresence>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {getDropTableOrder(
              goldEnabled,
              purpleEnabled,
              blueEnabled,
              greenEnabled
            )
              .filter((t) => !isNoChance(selectedStage, t))
              .map((t) => (
                <TableRow key={t} item={t} />
              ))}
          </AnimatePresence>
        </tbody>
      </LayoutGroup>
    </Table>
  );
};
