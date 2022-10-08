import {
  Button,
  createStyles,
  Table,
  Text,
  useMantineTheme,
} from "@mantine/core";
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

export const TableRows: FC<{ items: JODrops[] }> = ({ items }) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectState);
  const {
    selectedStage,
    goldEnabled,
    purpleEnabled,
    blueEnabled,
    greenEnabled,
  } = useAppSelector(selectSettings);

  const { colors } = useMantineTheme();
  const { classes } = useStyles();

  return (
    <>
      {items
        .filter((v) => !isNoChance(selectedStage, v))
        .map((type) => {
          const rates = JOINT_OPS_RATES[selectedStage][type];
          const counts = state.joCounts[selectedStage]?.counts?.[type];
          const currentPity = counts?.currentPity ?? 0;

          return (
            <tr key={type} className={classes.tableRow}>
              <td
                className={classes.opacityChange}
                style={{
                  color: [GearTypes.Gold, MatrixTypes.Gold].includes(type)
                    ? colors["gold-items"][0]
                    : [GearTypes.Purple, MatrixTypes.Purple].includes(type)
                    ? colors["purple-items"][0]
                    : [GearTypes.Blue, MatrixTypes.Blue].includes(type)
                    ? colors["blue-items"][0]
                    : colors["green-items"][0],
                }}
              >
                {DROPS_NAMES[type]}
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
                        type,
                      })
                    )
                  }
                >
                  Drop
                </Button>
              </td>
            </tr>
          );
        })}
    </>
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

  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>Chest #1</th>
          <th>Chest #2</th>
          <th>Chest #3</th>
          <th>Current Pity</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {goldEnabled && (
          <TableRows items={[GearTypes.Gold, MatrixTypes.Gold]} />
        )}
        {purpleEnabled && (
          <TableRows items={[GearTypes.Purple, MatrixTypes.Purple]} />
        )}
        {blueEnabled && (
          <TableRows items={[GearTypes.Blue, MatrixTypes.Blue]} />
        )}
        {greenEnabled && (
          <TableRows items={[GearTypes.Green, MatrixTypes.Green]} />
        )}
      </tbody>
    </Table>
  );
};
