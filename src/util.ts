import { useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>();

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
