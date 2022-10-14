import { Box, createStyles, DefaultMantineColor, Tuple } from "@mantine/core";
import { motion } from "framer-motion";
import { FC } from "react";
import { PityCounter } from "./components/pity-counter";
import { useIsCompact, useVersionMigrations } from "./hooks";

type ExtendedCustomColors =
  | "gold-items"
  | "purple-items"
  | "blue-items"
  | "green-items"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const useStyles = createStyles((t, { compact }: { compact: boolean }) => ({
  background: {
    backgroundColor: t.colors.dark[7],
    height: "100%",
    width: "100%",
    paddingTop: compact ? 0 : "10vw",
    paddingBottom: compact ? 0 : "10vw",
    overflow: "auto",
    transition: `all .3s ${t.transitionTimingFunction}`,
  },
  centerArea: {
    backgroundColor: t.colors.dark[4],
    minHeight: compact ? "100%" : "200px",
    maxWidth: compact ? "100%" : "800px",
    width: compact ? "100%" : "90%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: compact ? 0 : t.radius.lg,
    boxShadow: t.shadows.lg,
    padding: 20,
    transition: `all .3s ${t.transitionTimingFunction}`,
  },
}));

export const App: FC = () => {
  const compact = useIsCompact();
  const { classes } = useStyles({ compact });

  useVersionMigrations();

  return (
    <Box className={classes.background}>
      <motion.div layout className={classes.centerArea}>
        <PityCounter />
      </motion.div>
    </Box>
  );
};
