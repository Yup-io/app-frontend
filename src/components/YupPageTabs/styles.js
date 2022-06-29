import { styled } from '@mui/material';
import { YupContainer } from '../styles';

export const TabsContainer = styled(YupContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
    paddingRight: 0
  }
}));
