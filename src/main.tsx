import { DefaultMantineColor, MantineProvider, Tuple } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { App } from "./app";
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
