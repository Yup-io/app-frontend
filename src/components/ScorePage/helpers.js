import { Brand, Other } from '../../utils/colors';

  export const scoreToColor = (score) => {
    return score >= 80 && score <= 100
      ? Brand.mint
      : score >= 60 && score <= 80
      ? Other.moss
      : score >= 40 && score <= 60
      ? Brand.yellow
      : score >= 20 && score <= 40
      ? Brand.orange
      : Brand.red;
  };  
  export const scoreToColorText = (score) => {
    return score >= 80 && score <= 100
      ? 'green'
      : score >= 60 && score <= 80
      ? 'greenish'
      : score >= 40 && score <= 60
      ? 'yellow'
      : score >= 20 && score <= 40
      ? 'orange'
      : 'red';
  };