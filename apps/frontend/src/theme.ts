import {
  StyleConfig,
  extendTheme,
  withDefaultColorScheme,
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

const theme = extendTheme(
  {
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
        50: '#dbf2f2',
        100: '#c9ecec',
        200: '#b7e6e6',
        300: '#93d9d9',
        400: '#6fcdcd',
        500: '#4bc0c0',
        600: '#3c9a9a',
        700: '#266060',
        800: '#1e4d4d',
        900: '#0f2626',
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' })
);

export default theme;
