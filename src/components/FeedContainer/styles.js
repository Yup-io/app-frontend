import { Box, styled } from '@mui/material';
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

export const HeaderRoot = styled('div')(({ theme }) => ({
  background: 'transparent',
  zIndex: 100,
  width: '600px',
  margin: '0 auto',
  position: 'relative',
  padding: '80px 0px 35px 0px',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    padding: '70px 0px 25px 15px',
    width: '100vw'
  }
}));

export const HeaderImageWrapper = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
  width: 90,
  [theme.breakpoints.down('sm')]: {
    width: 80
  }
}));

export const HeaderImage = styled('img')(({ theme }) => ({
  borderRadius: '15%'
}));
