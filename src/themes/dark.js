import { Error, Gradients, Mono, Prime, Warning } from '../utils/colors';
import { createThemeWithPalette } from './_helpers';

const palette = {
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
};

const darkTheme = createThemeWithPalette(palette);

export default darkTheme;
