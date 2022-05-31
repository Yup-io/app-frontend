import { FlexBox } from '../styles'
import { CircularProgress } from '@mui/material'

const LoadingSpin = () => {
  return (
    <FlexBox justifyContent="center">
      <CircularProgress />
    </FlexBox>
  );
};

export default LoadingSpin;
