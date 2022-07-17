import { Box, Skeleton } from '@mui/material';
import { FlexBox } from '../styles';

const UserConnectionSkeleton = () => {
  return (
    <FlexBox alignItems="center">
      <Skeleton variant="circular" animation="wave" width={50} height={50} />
      <Box flexGrow={1} ml={3}>
        <Skeleton animation="wave" height={20} />
        <Skeleton animation="wave" width="60%" height={15} />
      </Box>
    </FlexBox>
  );
};

export default UserConnectionSkeleton;
