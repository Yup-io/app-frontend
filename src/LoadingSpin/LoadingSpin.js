import { FlexBox } from '../components/styles';
import { CircularProgress } from '@mui/material';

const LoadingSpin = () => {
  return (
    <FlexBox justifyContent="center">
      <CircularProgress color="primary" />
    </FlexBox>
  );
};

export default LoadingSpin;
