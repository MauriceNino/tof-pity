import { useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { selectSettings, settingsActions } from "../redux/settingsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { GearTypes, JODrops, MatrixTypes } from "../types/joint-ops";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export const useIsCompact = () => {
  const ws = useWindowSize();
  const theme = useMantineTheme();

  return (
    ws != null &&
    (ws.width < theme.breakpoints.md || ws.height < theme.breakpoints.xs)
  );
};

export const useDropTableOrder = (respectSettings = true) => {
  const { goldEnabled, purpleEnabled, blueEnabled, greenEnabled } =
    useAppSelector(selectSettings);

  const dropTable: JODrops[] = [];

  if (goldEnabled || !respectSettings)
    dropTable.push(GearTypes.Gold, MatrixTypes.Gold);
  if (purpleEnabled || !respectSettings)
    dropTable.push(GearTypes.Purple, MatrixTypes.Purple);
  if (blueEnabled || !respectSettings)
    dropTable.push(GearTypes.Blue, MatrixTypes.Blue);
  if (greenEnabled || !respectSettings)
    dropTable.push(GearTypes.Green, MatrixTypes.Green);

  return dropTable;
};

export const useVersionMigrations = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  useEffect(() => {
    if (settings.compactLayout == null) {
      dispatch(settingsActions.changeSetting({ compactLayout: true }));
    }
    if (settings.chipCounter == null) {
      dispatch(settingsActions.changeSetting({ chipCounter: false }));
    }
    if (settings.chipCounterWarning == null) {
      dispatch(settingsActions.changeSetting({ chipCounterWarning: true }));
    }
  }, []);
};
