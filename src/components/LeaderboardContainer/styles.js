import { FormControl, styled } from '@mui/material';
import { FlexBox } from '../styles';

export const ContainerRoot = styled(FlexBox)(({ theme }) => ({
  flexDirection: 'column',
  height: '100%'
}));

export const FilterFormControl = styled(FormControl)(({ theme }) => ({
  marginRight: theme.spacing(1),
  width: 155,
  [theme.breakpoints.down('sm')]: {
    width: 115
  }
}));

export const FeedListRoot = styled('div')(({ theme }) => ({
  overflow: 'scroll',
  textAlign: 'center',
  marginTop: theme.spacing(1)
}));
