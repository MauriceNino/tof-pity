import {
  Box,
  Button,
  createStyles,
  DefaultMantineColor,
  Stack,
  Text,
  Tuple,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { PityCounter } from './components/pity-counter';
import { UpdatePwa } from './components/update-pwa';
import { useIsCompact, useVersionMigrations } from './hooks';

type ExtendedCustomColors =
  | 'gold-items'
  | 'purple-items'
  | 'blue-items'
  | 'green-items'
  | DefaultMantineColor;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}

const useStyles = createStyles((t, { compact }: { compact: boolean }) => ({
  background: {
    backgroundColor: t.colors.dark[7],
    height: '100%',
    width: '100%',
    paddingTop: compact ? 0 : '10vw',
    paddingBottom: compact ? 0 : '10vw',
    overflow: 'auto',
    transition: `all .3s ${t.transitionTimingFunction}`,
  },
  centerArea: {
    backgroundColor: t.colors.dark[4],
    minHeight: compact ? '100%' : '200px',
    maxWidth: compact ? '100%' : '800px',
    width: compact ? '100%' : '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: compact ? 0 : t.radius.lg,
    boxShadow: t.shadows.lg,
    padding: 20,
    transition: `all .3s ${t.transitionTimingFunction}`,
  },
}));

const OnErrorContent: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Stack spacing='xs' justify='space-between' style={{ height: '100%' }}>
      <Text>Oops an error happened while rendering the application.</Text>
      <Button onClick={resetErrorBoundary}>Reload</Button>
    </Stack>
  );
};

export const App: FC = () => {
  const compact = useIsCompact();
  const { classes } = useStyles({ compact });

  const needsMajorUpdate = useVersionMigrations();

  return (
    <>
      <Box className={classes.background}>
        <motion.div layout className={classes.centerArea}>
          <ErrorBoundary FallbackComponent={OnErrorContent}>
            {!needsMajorUpdate && <PityCounter />}
          </ErrorBoundary>
        </motion.div>
      </Box>

      <UpdatePwa />
    </>
  );
};
