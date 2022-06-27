import { createTheme } from '@mui/material';

export const createThemeWithPalette = ({ palette, ...restPalette }) =>
  createTheme({
    palette: {
      ...palette,
      ...restPalette
    },
    components: {
      body: {
        styleOverrides: {
          backgroundColor: palette.M500
        }
      },
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
        }
      },
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
          }
        }
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
      MuiContainer: {
        styleOverrides: {
          root: ({ theme }) => ({
            [theme.breakpoints.down('xl')]: {
              maxWidth: 1200
            },
            [theme.breakpoints.down('lg')]: {
              maxWidth: 850
            },
            [theme.breakpoints.down('md')]: {
              maxWidth: 550
            }
          })
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
       capsized_h1: {
        fontWeight: 600,
        fontSize: '4.5rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.1665em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.1835em',
          display: 'table'
        }
      },
      h2: {
        fontWeight: 700,
        fontSize: '3.4375rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      capsized_h2: {
        fontWeight: 700,
        fontSize: '3.4375rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.45em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.26em',
          display: 'table'
        }
      },
      h3: {
        fontWeight: 600,
        fontSize: '2.75rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      capsized_h3: {
        fontWeight: 600,
        fontSize: '2.75rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.121em',
          display: 'table'
        }
      },
      h4: {
        fontWeight: 400,
        fontSize: '2.125rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      capsized_h4: {
        fontWeight: 400,
        fontSize: '2.125rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.212em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.44em',
          display: 'table'
        }
      },
      h5: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      capsized_h5: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.041em',
          display: 'table'
        }
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      capsized_h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.121em',
          display: 'table'
        }
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: '125%',
        color: `${palette.M50}DD`
      },
      capsized_subtitle1: {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: '100%',
        color: `${palette.M50}DD`,
         '&::before': {
          content: '""',
          marginBottom: '-0.2155em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.0445em',
          display: 'table'
        }
      },
      subtitle2: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: '135%',
        color: `${palette.M50}DD`
      },
      capsized_subtitle2: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: '100%',
        color: `${palette.M50}DD`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.121em',
          display: 'table'
        }
      },
      body1: {
        fontWeight: 600,
        fontSize: '0.9375rem',
        lineHeight: '135%',
        color: `${palette.M50}EE`
      },
      capsized_body1: {
        fontWeight: 600,
        fontSize: '0.9375rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.121em',
          display: 'table'
        }
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: '135%',
        color: `${palette.M50}DE`
      },
      capsized_body2: {
        fontWeight: 400,
        fontSize: '0.9375rem',
        lineHeight: '100%',
        color: `${palette.M50}DE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.6em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.3em',
          display: 'table'
        }
      },
      caption: {
        fontStyle: 600,
        fontSize: '1rem',
        color: `${palette.M50}DE`
      },
      capsized_caption: {
        fontStyle: 600,
        fontSize: '1rem',
        color: `${palette.M50}DE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.121em',
          display: 'table'
        }
      },
      tooltip: {
        fontWeight: 200,
        fontSize: '0.75rem'
      },
      capsized_tooltip: {
        fontWeight: 200,
        fontSize: '0.75rem',
        '&::before': {
          content: '""',
          marginBottom: '-0.2127em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.0447em',
          display: 'table'
        }
      },
      label: {
        fontWeight: 700,
        fontSize: '0.8rem',
        lineHeight: '135%'
      },
      capsized_label: {
        fontWeight: 700,
        fontSize: '0.8rem',
        lineHeight: '100%',
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.041em',
          display: 'table'
        }
      },
      colorError: {
        color: '#EB3650'
      },
      score: {
        fontWeight: 900,
        fontSize: '10rem',
        lineHeight: '100%'
      },
      capsized_score: {
        fontWeight: 900,
        fontSize: '10rem',
        lineHeight: '100%',
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.041em',
          display: 'table'
        }
      },
      scoreText: {
        fontWeight: 700,
        fontSize: '2.125rem',
        lineHeight: '125%',
        color: `${palette.M50}EE`
      },
      capsized_scoreText: {
        fontWeight: 700,
        fontSize: '2.125rem',
        lineHeight: '100%',
        color: `${palette.M50}EE`,
        '&::before': {
          content: '""',
          marginBottom: '-0.214em',
          display: 'table'
        },
        '&::after': {
          content: '""',
          marginTop: '-0.041em',
          display: 'table'
        }
      }
    },
    shape: {
      borderRadius: 8
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
  });
