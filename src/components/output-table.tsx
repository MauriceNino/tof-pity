import {
  Button,
  createStyles,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import {
  DROPS_NAMES,
  isNoChance,
  JOINT_OPS_RATES,
} from "../constants/joint-ops";
import { selectSettings } from "../redux/settingsSlice";
import { selectState, stateActions } from "../redux/stateSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  GearTypes,
  JODrops,
  MatrixTypes,
  PerChestRates,
} from "../types/joint-ops";

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
  const { selectedStage } = useAppSelector(selectSettings);

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
      <td className={classes.opacityChange}>
        {getDropsChance(rates, 0, counts?.currentPity)}
      </td>
      <td className={classes.opacityChange}>
        {getDropsChance(rates, 1, counts?.currentPity)}
      </td>
      <td className={classes.opacityChange}>
        {getDropsChance(rates, 2, counts?.currentPity)}
      </td>
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

export const OutputTable: FC = () => {
  const {
    selectedStage,
    goldEnabled,
    purpleEnabled,
    blueEnabled,
    greenEnabled,
  } = useAppSelector(selectSettings);
  const { classes } = useStyles();

  return (
    <Table>
      <thead>
        <tr>
          <motion.th layout></motion.th>
          <motion.th layout>Chest #1</motion.th>
          <motion.th layout>Chest #2</motion.th>
          <motion.th layout>Chest #3</motion.th>
          <motion.th layout>Current Pity</motion.th>
          <motion.th layout></motion.th>
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
    </Table>
  );
};
