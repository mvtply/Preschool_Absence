import { createTheme } from '@mui/material/styles';

// University of Cambridge Primary School pastel theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#7FB3D3', // Soft blue
      light: '#B4D4E8',
      dark: '#5A9BC1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#90C695', // Soft green
      light: '#B8D8BB',
      dark: '#6BAA71',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFBFC',
      paper: '#FFFFFF',
    },
    info: {
      main: '#B39DDB', // Soft purple
      light: '#D1C4E9',
      dark: '#9575CD',
    },
    warning: {
      main: '#FFD54F', // Soft yellow
      light: '#FFE082',
      dark: '#FFC107',
    },
    error: {
      main: '#FF8A80',
      light: '#FFCDD2',
      dark: '#F44336',
    },
    success: {
      main: '#A5D6A7',
      light: '#C8E6C9',
      dark: '#4CAF50',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#2C3E50',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      color: '#2C3E50',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: '#2C3E50',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: '#2C3E50',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#2C3E50',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#2C3E50',
    },
    body1: {
      fontSize: '1rem',
      color: '#2C3E50',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#5D6D7E',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;