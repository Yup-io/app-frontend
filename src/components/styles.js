import { Box, Container, styled } from '@mui/material';
import NextLink from 'next/link';

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
