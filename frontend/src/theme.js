import { createTheme } from '@mui/material/styles';
import colors from './config/colors';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: mode === 'light' ? colors.bg.main : colors.bg.mainDark,
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? colors.text.primary : colors.header.textDark,
      secondary: mode === 'light' ? colors.text.secondary : '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light' ? colors.sidebar.bg : colors.sidebar.bgDark,
        },
      },
    },
  },
});

export default getTheme;

