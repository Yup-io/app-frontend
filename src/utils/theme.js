import { createMuiTheme } from '@material-ui/core/styles'
import Colors from './colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: Colors.White,
      main: Colors.White,
      contrastText: Colors.Black
    },
    secondary: {
      main: Colors.Black
    },
    third: {
      main: '#00eab7'
    },
    background: {
      default: Colors.Green
    }
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'capitalize'
      },
      outlined: {
        borderRadius: '0.25rem',
        border: 'none',
        color: Colors.White,
        boxShadow:
          '5px 5px 30px 0 rgba(10, 10, 10, 0.2), -5px -5px 30px 0 rgba(170, 170, 170, 0.1)',
        lineHeight: '23px',
        letterSpacing: '1%',
        fontWeight: '500',
        fontFamily: '"Gilroy", sans-serif',
        '&:hover': {
          boxShadow:
            '8px 8px 30px 0 rgba(0, 0, 0, 0.06), -8px -8px 15px 0 rgba(170, 170, 170, 0.03), inset 8px 8px 30px 0 rgba(0, 0, 0, 0.06), inset -8px -8px 15px 0 rgba(170, 170, 170, 0.03)',
          backgroundColor: 'inherit'
        }
      },
      contained: {
        borderRadius: '0.25rem',
        border: 'none',
        backgroundColor: Colors.Green,
        color: Colors.Black,
        boxShadow:
          '5px 5px 30px 0 rgba(10, 10, 10, 0.2), -5px -5px 30px 0 rgba(170, 170, 170, 0.1)',
        lineHeight: '23px',
        letterSpacing: '1%',
        fontWeight: '500',
        fontFamily: '"Gilroy", sans-serif',
        '&:hover': {
          boxShadow:
            '8px 8px 30px 0 rgba(0, 0, 0, 0.06), -8px -8px 15px 0 rgba(170, 170, 170, 0.03), inset 8px 8px 30px 0 rgba(0, 0, 0, 0.06), inset -8px -8px 15px 0 rgba(170, 170, 170, 0.03)',
          backgroundColor: Colors.Green
        }
      }
    },
    MuiIconButton: {
      root: {
        borderRadius: '100px',
        boxShadow:
          '8px 8px 30px 0 rgba(0, 0, 0, 0.04), -8px -8px 15px 0 rgba(170, 170, 170, 0.02), inset 8px 8px 30px 0 rgba(0, 0, 0, 0.04), inset -8px -8px 15px 0 rgba(170, 170, 170, 0.02)',
        '&:hover': {
          boxShadow:
            '-8px -8px 30px 0 rgba(0, 0, 0, 0.04), 8px 8px 15px 0 rgba(170, 170, 170, 0.02), inset -8px -8px 30px 0 rgba(0, 0, 0, 0.04), inset 8px 8px 15px 0 rgba(170, 170, 170, 0.02)',
          backgroundColor: 'inherit'
        }
      }
    },
    MuiInputLabel: {
      shrink: {
        color: `${Colors.White} !important`
      }
    },
    MuiInput: {
      underline: {
        '&:before': {
          borderBottomColor: Colors.Grey
        },
        '&:hover': {
          borderBottomColor: Colors.White
        }
      }
    },
    MuiTextField: {
      root: {
        color: Colors.White
      }
    },
    MuiDialogActions: {
      root: {
        padding: '8px 24px'
      }
    }
  },
  typography: {
    h1: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '4rem',
      lineHeight: '3.25rem',
      marginBottom: '0.2rem'
    },
    h2: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: '2.5rem'
    },
    h3: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: '1.75rem',
      lineHeight: '2.5rem'
    },
    h4: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '1.375rem',
      lineHeight: '2rem'
    },
    h5: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: '1.4rem'
    },
    h6: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: '1rem',
      lineHeight: '1.25rem'
    },
    subtitle1: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 300,
      fontSize: '1.625rem',
      lineHeight: '1.25rem'
    },
    subtitle2: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 200,
      fontSize: '1.2rem',
      lineHeight: '1.1875rem'
    },
    body1: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'normal',
      fontWeight: 300,
      color: Colors.White,
      fontSize: '0.875rem',
      lineHeight: '1rem'
    },
    display3: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'thin',
      fontSize: '20px',
      lineHeight: '20px',
      color: Colors.Green,
      fontWeight: '100'
    },
    display2: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'thin',
      fontSize: '34px',
      lineHeight: '59px',
      color: Colors.Green
    },
    display1: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: 'thin',
      fontSize: '24px',
      lineHeight: '29px',
      color: Colors.Yellow,
      fontWeight: '100'
    },
    headline: {
      fontSize: '20px',
      lineHeight: '29px',
      color: Colors.Yellow,
      fontStyle: 'thin',
      letterSpacing: '0.25%',
      paragraphSpacing: '16px'
    },
    title: {
      fontSize: '16px',
      lineHeight: '23px',
      letterSpacing: '0.75%',
      fontStyle: 'thin'
    },
    caption: {
      fontFamily: '"Gilroy", sans-serif',
      fontStyle: '600',
      fontSize: '16px'
    },
    subheading: {
      fontSize: '20px',
      lineHeight: '29px',
      letterSpacing: '0.15%',
      color: Colors.Grey,
      fontStyle: 'thin'
    },
    body2: {
      fontSize: '14px',
      lineHeight: '21px',
      color: Colors.Grey,
      letterSpacing: '0.25%',
      fontWeight: '100'

    },
    colorError: {
      color: Colors.Red
    },
    fontFamily: '"Gilroy", sans-serif'
  },
  props: {
    MuiWithWidth: {
      initialWidth: 'lg'
    }
  }
})

export default theme
