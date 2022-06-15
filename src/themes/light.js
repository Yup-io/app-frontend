import { Error, Gradients, Mono, Prime, Warning } from '../utils/colors';
import { createThemeWithPalette } from './_helpers';

const palette = {
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
};

const lightTheme = createThemeWithPalette(palette);

export default lightTheme;
