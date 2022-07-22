import { FormControl, styled } from '@mui/material';

export const FilterFormControl = styled(FormControl)(({ theme }) => ({
  marginRight: theme.spacing(1),
  width: 155,
  [theme.breakpoints.down('sm')]: {
    width: 115
  }
}));
