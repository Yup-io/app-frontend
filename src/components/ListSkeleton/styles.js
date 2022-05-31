import { Skeleton, styled } from '@mui/material'

export const SkeletonItem = styled(Skeleton)(({ theme }) => ({
  height: 60,
  margin: theme.spacing(2, 0)
}));
