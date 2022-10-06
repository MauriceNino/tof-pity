import { Box, createStyles, MantineProvider } from "@mantine/core";
import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { PityCounter } from "./components/pity-counter";
import { useIsCompact } from "./util";

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
    borderRadius: t.radius.lg,
    boxShadow: t.shadows.lg,
    padding: 20,
    transition: `all .3s ${t.transitionTimingFunction}`,
  },
}));

export const App: FC = () => {
  const compact = useIsCompact();
  const { classes } = useStyles({ compact });

  return (
    <Box className={classes.background}>
      <Box className={classes.centerArea}>
        <PityCounter />
      </Box>
    </Box>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        globalStyles: (theme) => ({
          "html, body, #root": {
            height: "100%",
            width: "100%",
          },
        }),
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);
