import { styled } from '@mui/material';

export const YupPageHeaderRoot= styled('div')(({ theme, scrolled, noborder }) => ({
  backgroundColor: scrolled ? `${theme.palette.M850}20` : 'transparent',
  backdropFilter: scrolled ? 'blur(40px)' : 'none',
  position: 'sticky',
  top: 0,
  width: '100%',
  borderWidth: noborder ? 0 : '0 0 1px 0',
  borderStyle: 'solid',
  borderImage: `linear-gradient(to right, transparent, ${theme.palette.M500}, transparent) 1`,
  zIndex: 1003,
  [theme.breakpoints.down('md')]: {
    backgroundColor: `${theme.palette.M900}88`
  }
}));
