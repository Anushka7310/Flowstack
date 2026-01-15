import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066CC',
      light: '#4D94FF',
      dark: '#004B99',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00BCD4',
      light: '#4DD0E1',
      dark: '#0097A7',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    divider: '#E0E0E0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.015625rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '0rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '0rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '0.0125rem',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700,
      letterSpacing: '0rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700,
      letterSpacing: '0.03125rem',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.03125rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.0125rem',
      lineHeight: 1.43,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.0625rem',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.0333rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 24,
          padding: '10px 24px',
          fontSize: '0.875rem',
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
            transition: 'box-shadow 0.3s ease-in-out',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#0066CC',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
})
