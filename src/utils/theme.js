import { Gradients, Warning, Error, Mono, Prime } from './colors'

export const darkPalette = {
  palette: {
    type: 'dark',
    M50: Mono.M50,
    M100: Mono.M100,
    M150: Mono.M150,
    M200: Mono.M200,
    M300: Mono.M300,
    M400: Mono.M400,
    M500: Mono.M500,
    M600: Mono.M600,
    M700: Mono.M700,
    M750: Mono.M750,
    M800: Mono.M800,
    M850: Mono.M850,
    M900: Mono.M900,
    M100_OP5: Mono.M100_OP5,
    M100_OP1: Mono.M100_OP1,
    M500_OP5: Mono.M500_OP5,
    M500_OP1: Mono.M500_OP1,
    M800_OP5: Mono.M800_OP5,
    M800_OP1: Mono.M800_OP1,
    P50: Prime.P50,
    P100: Prime.P100,
    P150: Prime.P150,
    P200: Prime.P200,
    P300: Prime.P300,
    P400: Prime.P400,
    P500: Prime.P500,
    P600: Prime.P600,
    P700: Prime.P700,
    P800: Prime.P800,
    P850: Prime.P850,
    P900: Prime.P900,
    P400_OP5: Prime.P400_OP5,
    P500_OP5: Prime.P500_OP5,
    P500_OP25: Prime.P500_OP25,
    P500_OP1: Prime.P500_OP1,
    P600_OP5: Prime.P600_OP5,
    P600_OP25: Prime.P600_OP25,
    P600_OP1: Prime.P600_OP1,
    W50: Warning.W50,
    W100: Warning.W100,
    W200: Warning.W200,
    W300: Warning.W300,
    W400: Warning.W400,
    W500: Warning.W500,
    W600: Warning.W600,
    W700: Warning.W700,
    W800: Warning.W800,
    W900: Warning.W900,
    W950: Warning.W950,
    E50: Error.E50,
    E100: Error.E100,
    E200: Error.E200,
    E300: Error.E300,
    E400: Error.E400,
    E500: Error.E500,
    E600: Error.E600,
    E700: Error.E700,
    E800: Error.E800,
    E900: Error.E900,
    E950: Error.E950
  },
  gradients: {
    horizontal: Gradients.brand.horizontal,
    vertical: Gradients.brand.vertical,
    D225: Gradients.brand.D225,
    D135: Gradients.brand.D135
  },
  text: {
    primary: Mono.M50,
    secondary: Mono.M100
  },
  shadow: {
    first: Mono.M900,
    second: Mono.M900
  },
  action: {
    hover: Mono.M850
  }
}

export const lightPalette = {
  palette: {
    type: 'light',
    M50: Mono.M900,
    M100: Mono.M850,
    M150: Mono.M800,
    M200: Mono.M750,
    M300: Mono.M700,
    M400: Mono.M600,
    M500: Mono.M500,
    M600: Mono.M400,
    M700: Mono.M300,
    M750: Mono.M200,
    M800: Mono.M150,
    M850: Mono.M100,
    M900: Mono.M50,
    M100_OP5: Mono.M100_OP5,
    M100_OP1: Mono.M100_OP1,
    M500_OP5: Mono.M500_OP5,
    M500_OP1: Mono.M500_OP1,
    M800_OP5: Mono.M800_OP5,
    M800_OP1: Mono.M800_OP1,
    P50: Prime.P900,
    P100: Prime.P850,
    P150: Prime.P800,
    P200: Prime.P750,
    P300: Prime.P700,
    P400: Prime.P600,
    P500: Prime.P500,
    P600: Prime.P400,
    P700: Prime.P300,
    P750: Prime.P200,
    P800: Prime.P150,
    P850: Prime.P100,
    P900: Prime.P50,
    P400_OP5: Prime.P400_OP5,
    P500_OP5: Prime.P500_OP5,
    P500_OP25: Prime.P500_OP25,
    P500_OP1: Prime.P500_OP1,
    P600_OP5: Prime.P600_OP5,
    P600_OP25: Prime.P600_OP25,
    P600_OP1: Prime.P600_OP1,
    W50: Warning.W950,
    W100: Warning.W900,
    W200: Warning.W800,
    W300: Warning.W700,
    W400: Warning.W600,
    W500: Warning.W500,
    W600: Warning.W400,
    W700: Warning.W300,
    W800: Warning.W200,
    W900: Warning.W100,
    W950: Warning.W50,
    E50: Error.E950,
    E100: Error.E900,
    E200: Error.E800,
    E300: Error.E700,
    E400: Error.E600,
    E500: Error.E500,
    E600: Error.E400,
    E700: Error.E300,
    E800: Error.E200,
    E900: Error.E100,
    E950: Error.E50
  },
  gradients: {
    horizontal: Gradients.brand.horizontal,
    vertical: Gradients.brand.vertical,
    D225: Gradients.brand.D225,
    D135: Gradients.brand.D135
  },
  primary: {
    main: Mono.M850,
    gradient: Gradients.background.light
  },
  secondary: {
    main: Mono.M900
  },
  third: {
    main: Prime.P500
  },
  text: {
    primary: Mono.M900,
    secondary: Mono.M400
  },
  shadow: {
    first: Mono.M400,
    second: Mono.M300
  },
  action: {
    hover: Mono.M150
  }
}

export const theme = ({ palette }) => {
  return {
    overrides: {
      body: {
        backgroundColor: palette.M500
      },
      MuiButton: {
        root: {
          width: '100%',
          fontStyle: 'normal',
          borderRadius: '8px',
          letterSpacing: '0.02em',
          textTransform: 'capitalize'
        },
        containedPrimary: {
          border: 'none',
          boxShadow: 'none',
          color: palette.M900,
          backgroundColor: palette.P400,
          transition: '0.3s box-shadow !important',
          '&:hover': {
            border: 'none',
            boxShadow: `0 0 0 2px ${palette.P400}`,
            backgroundColor: palette.P400
          },
          '&:active': {
            boxShadow: 'none'
          },
          '&:disabled': {
            backgroundColor: palette.P700
          },
          '&:selected': {
            backgroundColor: palette.P600
          }
        },
        outlinedPrimary: {
          border: 'none',
          boxShadow: 'none',
          color: palette.P400,
          backgroundColor: palette.P500_OP25,
          '&:hover': {
            border: 'none',
            boxShadow: `0 0 0 2px ${palette.P500_OP25}`,
            color: palette.P300,
            backgroundColor: palette.P500_OP25
          },
          '&:disabled': {
            color: palette.P600,
            backgroundColor: palette.P500_OP1
          },
          '&:selected': {
            color: palette.P500,
            backgroundColor: palette.P600_OP1
          }
        },
        textPrimary: {
          border: 'none',
          boxShadow: 'none',
          color: palette.P400,
          '&:hover': {
            border: 'none',
            color: palette.P300,
            backgroundColor: 'transparent'
          },
          '&:disabled': {
            color: palette.P600,
            backgroundColor: 'transparent'
          },
          '&:selected': {
            color: palette.P500,
            backgroundColor: 'transparent'
          }
        },
        containedSecondary: {
          border: 'none',
          boxShadow: 'none',
          color: palette.M900,
          backgroundColor: palette.M50,
          transition: '0.3s box-shadow !important',
          '&:hover': {
            border: 'none',
            boxShadow: `0 0 0 2px ${palette.M50}`,
            backgroundColor: palette.M50
          },
          '&:disabled': {
            backgroundColor: palette.M400
          },
          '&:selected': {
            backgroundColor: palette.M150
          }
        },
        outlinedSecondary: {
          border: 'none',
          boxShadow: 'none',
          color: palette.M50,
          backgroundColor: palette.M100_OP1,
          '&:hover': {
            border: 'none',
            boxShadow: `0 0 0 2px ${palette.M700}`,
            color: palette.M50,
            backgroundColor: palette.M100_OP25
          },
          '&:disabled': {
            color: palette.M200,
            backgroundColor: palette.M100_OP1
          },
          '&:selected': {
            color: palette.M100,
            backgroundColor: palette.M100_OP25
          }
        },
        textSecondary: {
          border: 'none',
          boxShadow: 'none',
          color: palette.M50,
          '&:hover': {
            border: 'none',
            color: palette.M50,
            backgroundColor: 'transparent'
          },
          '&:disabled': {
            color: palette.M200,
            backgroundColor: 'transparent'
          },
          '&:selected': {
            color: palette.M100,
            backgroundColor: 'transparent'
          }
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '15px',
          fontWeight: 600,
          lineHeight: '125%'
        },
        // Has no effect, no medium size in MUI Button
        sizeMedium: {
          padding: '8px 12px',
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '135%'
        },
        sizeLarge: {
          padding: '10px 14px',
          fontSize: '18px',
          fontWeight: 'normal',
          lineHeight: '135%'
        }
      },
      MuiIconButton: {
        root: {
          borderRadius: '100px',
          border: 'none',
          boxShadow: `8px 8px 30px 0 ${palette.M100}04, -8px -8px 15px 0 ${palette.M100}02, inset 8px 8px 30px 0 ${palette.M100}04, inset -8px -8px 15px 0 ${palette.M100}02`,
          '&:hover': {
            boxShadow:
              '-8px -8px 30px 0 rgba(0, 0, 0, 0.04), 8px 8px 15px 0 rgba(170, 170, 170, 0.02), inset -8px -8px 30px 0 rgba(0, 0, 0, 0.04), inset 8px 8px 15px 0 rgba(170, 170, 170, 0.02)',
            backgroundColor: 'inherit'
          }
        }
      },
      MuiIcon: {
        root: {
          color: palette.M100
        }
      },
      MuiAvatar: {
        colorDefault: {
          color: palette.M100
        }
      },
      MuiTab: {
        root: {
          textTransform: 'capitalize',
          fontSize: '1.2rem'
        }
      },
      MuiTooltip: {
        tooltip: {
          color: '#fff',
          fontSize: '12px'
        }
      },
      MuiListItemIcon: {
        root: {
          color: palette.M300,
          overflow: 'visible',
          textAlign: 'center',
          justifyContent: 'center'
        }
      },
      MuiListSubheader: {
        root: {
          color: palette.M200
        }
      },
      MuiBadge: {
        colorSecondary: {
          backgroundColor: palette.M200
        }
      },
      MuiInputLabel: {
        shrink: {
          color: `${palette.M100}50`
        },
        outlined: {
          transform: 'translate(15%, 85%) scale(1)'
        }
      },
      MuiMenu: {
        paper: {
          backgroundColor: `${palette.M800}CC`,
          backdropFilter: 'blur(20px)'
        }
      },
      MuiMenuItem: {
        dense: {
          color: palette.M100
        }
      },
      MuiOutlinedInput: {
        root: {
          borderRadius: '0.625rem',
          borderColor: palette.M300,
          color: palette.M300,
          '&focused': {
            borderColor: palette.M100,
            outline: 'none'
          }
        },
        notchedOutline: {
          borderColor: palette.M500,
          color: palette.M100
        },
        input: {
          padding: '10px 14px'
        }
      },
      MuiTextField: {
        root: {
          color: palette.M300,
          borderColor: palette.M300,
          '&focused': {
            borderColor: palette.M100,
            outline: 'none'
          }
        }
      },
      MuiSelect: {
        icon: {
          color: palette.M50
        }
      },
      MuiDialogActions: {
        root: {
          padding: '8px 24px'
        }
      },
      MuiAppBar: {
        root: {
          background: palette.M800
        },
        colorPrimary: {
          backgroundColor: palette.M800
        }
      },
      MuiDrawer: {
        paper: {
          background: palette.M800
        }
      },
      MuiDialog: {
        paper: {
          backgroundColor: `${palette.M800}cc`,
          border: `1px solid ${palette.M800}`,
          borderRadius: '25px',
          backdropFilter: 'blur(45px)',
          boxShadow: `0 0 20px 6px ${palette.M100}05`,
          maxWidth: '80%',
          padding: '1rem 0.5rem'
        },
        backdrop: {
          backdropFilter: 'blur(3px)'
        }
      },
      MuiDialogContent: {
        root: {
          color: palette.M100
        }
      },
      MuiDialogTitle: {
        root: {
          fontWeight: 100,
          fontSize: '2.441rem',
          lineHeight: '105%',
          color: `${palette.M200}EE`
        }
      },
      MuiPaper: {
        root: {
          backgroundColor: palette.M700
        },
        rounded: {
          borderRadius: '0.65rem'
        }
      },
      MuiStepIcon: {
        root: {
          color: `${palette.P500} !important`
        },
        text: {
          fill: `${palette.M900} !important`
        }
      },
      MuiStepLabel: {
        label: {
          color: `${palette.M100} !important`
        }
      },
      MuiBackdrop: {
        root: {
          backgroundColor: `${palette.M300}40`,
          backdropFilter: 'blur(10px)'
        }
      },
      MuiFab: {
        extended: {
          textTransform: 'capitalize',
          backgroundColor: palette.M700,
          borderRadius: '0.65rem'
        }
      },
      MuiTouchRipple: {
        root: {
          opacity: 0.2
        }
      },
      MuiSkeleton: {
        wave: {
          background: `${palette.M600}AA`,
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${palette.M800}, transparent)`
          }
        }
      },
      MuiChip: {
        root: {
          color: palette.M50,
          backgroundColor: palette.M700,
          padding: '0 0.5rem',
          '&&:hover': {
            boxShadow: `0 0 0 2px ${palette.M700}`,
            backgroundColor: palette.M700
          }
        },
        icon: {
          height: 'minContent',
          color: palette.M100,
          fontSize: 'small !important',
          opacity: 0.4
        }
      }
    },
    typography: {
      fontFamily: [
        'Gilroy',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'sans-serif'
      ].join(','),
      fontStyle: 'normal',
      h1: {
        fontWeight: 600,
        fontSize: '4.5rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      h2: {
        fontWeight: 700,
        fontSize: '3.4375rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      h3: {
        fontWeight: 600,
        fontSize: '2.75rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      h4: {
        fontWeight: 400,
        fontSize: '2.125rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      h5: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: '125%',
        color: `${palette.M50}DD`
      },
      subtitle2: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: '135%',
        color: `${palette.M50}DD`
      },
      body1: {
        fontWeight: 600,
        fontSize: '0.9375rem',
        lineHeight: '135%',
        color: `${palette.M50}EE`
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: '135%',
        color: `${palette.M50}DE`
      },
      caption: {
        fontStyle: 600,
        fontSize: '1rem',
        color: `${palette.M50}DE`
      },
      tooltip: {
        fontWeight: 200,
        fontSize: '0.75rem'
      },
      label: {
        fontWeight: 700,
        fontSize: '0.8rem',
        lineHeight: '135%'
      },
      colorError: {
        color: '#EB3650'
      }
    },
    props: {
      MuiWithWidth: {
        initialWidth: 'lg'
      }
    },
    breakpoints: {
      values: {
        xs: 600,
        sm: 900,
        md: 1200,
        lg: 1488,
        xl: 1864
      }
    }
  }
}
