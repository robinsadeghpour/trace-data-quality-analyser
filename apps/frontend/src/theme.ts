import {
  StyleConfig,
  extendTheme,
  withDefaultColorScheme, ThemeConfig,
} from '@chakra-ui/react';

const components: Record<string, StyleConfig> = {
  Card: {
    baseStyle: {
      container: {
        backgroundColor: 'white',
      },
    },
  },
};

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme(
  {
    config,
    components,
    colors: {
      gray: {
        50: '#fcfcfc',
        100: '#f7f7f7',
        200: '#f0f0f0',
        300: '#e0e0e0',
        400: '#bfbfbf',
        500: '#969696',
        600: '#696969',
        700: '#474747',
        800: '#2b2b2b',
        900: '#242424',
      },
      primary: {
        50: '#f4e2d2',
        100: '#efd4bc',
        200: '#dfa879',
        300: '#d48b4c',
        400: '#ce7d35',
        500: '#FB8B24',
        600: '#b5631c',
        700: '#502c0c',
        800: '#281606',
        900: '#140b03',
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
);

export default theme;
