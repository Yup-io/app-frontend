import { Avatar, Box, Container, Menu, styled, Typography } from '@mui/material';
import { PROFILE_PICTURE_SIZE } from '../config';

export const FlexBox = styled(Box)(({ theme }) => ({
  display: 'flex'
}));

export const PageContainer = styled(Container)(({ theme }) => ({
  height: '100vh'
}));

export const PageLayout = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100vh',
  width: '100vw',
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingTop: 'var(--header-height)',

  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(2)
}));

export const TruncateText = styled(Typography)(({ lines }) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  textOverflow: 'ellipsis',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': `${lines || 1}`
}));

export const YupMenu = styled(Menu)(({ theme }) => ({
  '& svg': {
    marginRight: theme.spacing(1.5)
  }
}));

export const YupContainer = styled(Box)(({ theme, visible }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.only('md')]: {
    width: theme.breakpoints.values.md
  },
  [theme.breakpoints.only('lg')]: {
    width: theme.breakpoints.values.lg
  },
  [theme.breakpoints.only('xl')]: {
    width: 1280
  }
}));

export const YupPageWrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh'
}));

export const GradientTypography = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(270deg, #00E08E 0%, #A2CF7E 24.57%, #F0C909 50.35%, #FCA016 75.4%, #EB3650 100%)`,
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  backgroundClip: 'text',
  textFillColor: 'transparent'
}));

export const ProfilePicture = styled(Avatar)(({ theme, border, size }) => {
  const _size = size || 'lg';
  const imageSize = PROFILE_PICTURE_SIZE[_size];
  const borderSize = _size === 'lg' ? 3 : 1

  return {
    backgroundColor: theme.palette.M900,
    boxShadow: 'inset 2px 2px 0px 10px #AAAAAA10',
    width: imageSize,
    height: imageSize,
    border: `solid ${borderSize}px ${border}`
  };
});
