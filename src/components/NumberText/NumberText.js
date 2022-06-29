import { Typography } from '@mui/material'
import { FlexBox } from '../styles';

const NumberText = ({ number, text, clickable, onClick }) => (
  <FlexBox>
    <Typography variant="body1">
      {number}
    </Typography>
    <Typography
      variant="body2"
      onClick={onClick}
      sx={{
        ml: 0.5,
        cursor: clickable ? 'pointer' : 'auto',
        color: (theme) => theme.palette.M400
      }}
    >
      {text}
    </Typography>
  </FlexBox>
);

export default NumberText;
