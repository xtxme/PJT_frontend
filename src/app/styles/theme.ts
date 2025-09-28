'use client';

import { createTheme } from '@mui/material/styles';

const fontFamily = 'var(--font-ibm-plex-thai), sans-serif';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#df7544',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily,
  },
});

export default theme;
