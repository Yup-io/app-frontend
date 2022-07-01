import { Fab, styled } from '@mui/material'

export const TutorialsFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(12),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}));
