import { IconButton, styled } from '@mui/material';

export const ArrowButton = styled(IconButton)(({ theme }) => ({
  '& svg': {
    color: theme.palette.M400
  },
  '&.Mui-disabled': {
    opacity: 0.5
  }
}));
