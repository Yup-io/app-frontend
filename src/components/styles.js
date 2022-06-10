import { Box, Container, styled, Typography } from '@mui/material';

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
  '-webkit-line-clamp': `${lines || 1}`,
}));
