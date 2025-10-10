'use client';

import { createTheme } from '@mui/material/styles';

const fontFamily = "var(--font-ibm-plex-sans-thai), 'IBM Plex Sans Thai', sans-serif";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#df7544',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
      contrastText: '#df7544',
    },
  },
  typography: {
    fontFamily,
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
});

export default theme;
