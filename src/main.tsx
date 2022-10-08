import {
  Box,
  createStyles,
  DefaultMantineColor,
  MantineProvider,
  Tuple,
} from "@mantine/core";
import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { PityCounter } from "./components/pity-counter";
import { useIsCompact } from "./hooks";
import { persistor, store } from "./redux/store";

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

  return (
    <Box className={classes.background}>
      <Box className={classes.centerArea}>
        <PityCounter />
      </Box>
    </Box>
  );
};

const singularColor = (color: string) =>
  new Array(10).fill(0).map((_) => color) as Tuple<string, 10>;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: "dark",
            colors: {
              "gold-items": singularColor("#ffdb84"),
              "purple-items": singularColor("#e1beff"),
              "blue-items": singularColor("#b5dfff"),
              "green-items": singularColor("#a2e4cb"),
            },
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
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
