import { Input, styled } from '@mui/material';
import YupPageHeader from '../YupPageHeader';

export const SearchLayout = styled('div')(({ theme }) => ({
  position: 'fixed',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflowY: 'auto',
  minHeight: '100vh',
  zIndex: 1100,
  background: `${theme.palette.M850}CC`,
  backdropFilter: 'blur(20px)'
}));

export const StyledInput = styled(Input)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  background: theme.palette.M700,
  borderRadius: 100,
  '&::after, &::before': {
    borderBottom: 'none !important'
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.M500
  }
}));

export const SearchUiHeader = styled(YupPageHeader)(({ theme, scrolled }) => ({
  [theme.breakpoints.down('md')]: {
    backgroundColor: scrolled ? `${theme.palette.M900}88` : 'transparent'
  }
}));
