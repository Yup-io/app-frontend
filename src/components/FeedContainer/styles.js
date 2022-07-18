import { Box, styled } from '@mui/material';
import Image from 'next/image';
import { PageBody } from '../../_pages/pageLayouts';

export const ContainerRoot = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  maxWidth: '100vw',
  overflowY: 'hidden'
}));

export const PageContainer = styled(PageBody)(({ theme }) => ({
  width: '100%',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    backgroundSize: 'contain'
  }
}));

export const FeedWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginLeft: '0%',
    padding: '0%'
  }
}));

export const HeaderRoot = styled('div')(({ theme, isMinimize }) => ({
  background: 'transparent',
  zIndex: 100,
  width: '600px',
  margin: '0 auto',
  position: 'relative',
  padding: '80px 0px 35px 0px',
  paddingBottom: `${isMinimize ? 20 : 0}px;`,
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: '70px 0px 25px 15px',
    paddingBottom: `${isMinimize ? 20 : 0}px;`,
    width: '100vw'
  }
}));

export const HeaderImageWrapper = styled('div')(({ theme, isMinimize }) => ({
  marginRight: theme.spacing(2),
  width: `${!isMinimize ? 90 : 45}px;`,
  [theme.breakpoints.down('sm')]: {
    width: `${!isMinimize ? 80 : 40}px;`
  }
}));

export const HeaderImage = styled(Image)(({ theme }) => ({
  borderRadius: '15%'
}));
