import { Gradients, Warning, Error, Mono, Prime } from './colors'

export const darkPalette = {
  palette: {
    mode: 'dark',
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
    mode: 'light',
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
    components: {
      body: {
        styleOverrides: {
          backgroundColor: palette.M500
        } },
      MuiButton: {
        styleOverrides: {
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
            '&.Mui-selected': {
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
            '&.Mui-selected': {
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
            '&.Mui-selected': {
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
            '&.Mui-selected': {
              backgroundColor: palette.M150
            }
          },
          outlinedSecondary: {
            border: 'none',
            boxShadow: 'none',
            color: palette.M50,
            backgroundColor: palette.M800,
            '&:hover': {
              border: 'none',
              boxShadow: `0 0 0 2px ${palette.M800}`,
              color: palette.M50,
              backgroundColor: palette.M800
            },
            '&:disabled': {
              color: palette.M200,
              backgroundColor: palette.M850
            },
            '&.Mui-selected': {
              color: palette.M100,
              backgroundColor: palette.M800
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
            '&.Mui-selected': {
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
          sizeLarge: {
            padding: '10px 14px',
            fontSize: '18px',
            fontWeight: 'normal',
            lineHeight: '135%'
          }
        } },
      MuiIconButton: {

        styleOverrides: {
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
        }
      },
      MuiIcon: {
        styleOverrides: {
          root: {
            color: palette.M100
          }
        }
      },
      MuiAvatar: {
        styleOverrides: {
          colorDefault: {
            color: palette.M100
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'capitalize',
            fontSize: '1.2rem',
            '&.Mui-selected': {
              color: palette.M100
            }
          }
        }
      },
      MuiTooltip: {

        styleOverrides: {
          tooltip: {
            color: '#fff',
            fontSize: '12px'
          }
        }
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            color: palette.M300,
            overflow: 'visible',
            textAlign: 'center',
            justifyContent: 'center'
          }
        }
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            color: palette.M200
          }
        }
      },
      MuiBadge: {
        styleOverrides: {
          colorSecondary: {
            backgroundColor: palette.M200
          }
        }
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            '&$focused': {
              color: palette.M500
            },
            '&$error': {
              color: palette.E500
            }
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: `${palette.M900}10`,
            '&$focused': {
              color: palette.M100
            },
            '&$error': {
              borderColor: palette.E500
            }
          }
        }
      },

      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            padding: '8px 0px 8px 7px !important'
          } }
      },
      MuiHelperText: {

        styleOverrides: {
          root: {
            '&$error': {
              color: palette.E500
            }
          }
        }
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: `${palette.M800}CC`,
            backdropFilter: 'blur(20px)'
          },
          list: {
            backgroundColor: palette.M850
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          dense: {
            color: palette.M100
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            color: palette.M300,
            borderColor: palette.M300
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: palette.M50
          }
        }
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: '8px 24px'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: palette.M800
          },
          colorPrimary: {
            backgroundColor: palette.M800
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: palette.M800
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
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
        }
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            color: palette.M100
          }
        }
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontWeight: 100,
            fontSize: '2.441rem',
            lineHeight: '105%',
            color: `${palette.M200}EE`
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: palette.M700,
            boxShadow: 'none'
          },
          rounded: {
            borderRadius: '0.65rem'
          }
        }
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: `${palette.P500} !important`
          },
          text: {
            fill: `${palette.M900} !important`
          }
        }
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: `${palette.M100} !important`
          }
        }
      },
      MuiFab: {
        styleOverrides: {
          extended: {
            textTransform: 'capitalize',
            backgroundColor: palette.M700,
            borderRadius: '0.65rem'
          }
        }
      },
      MuiTouchRipple: {
        styleOverrides: {
          root: {
            opacity: 0.2
          }
        }
      },
      MuiSkeleton: {
        styleOverrides: {
          background: `${palette.M850}55`,
          wave: {
            background: `${palette.M700}55`,
            '&::after': {
              background: `linear-gradient(90deg, transparent, ${palette.M800}, transparent)`
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            color: palette.M50,
            backgroundColor: palette.M800,
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
      score: {
        fontWeight: 900,
        fontSize: '10rem',
        lineHeight: '100%'
      },
      scoreText: {
        fontWeight: 700,
        fontSize: '2.125rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
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
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1488
      }
    }
  }
}
