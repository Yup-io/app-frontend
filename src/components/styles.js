import { Box, Container, styled } from '@mui/material';

export const FlexBox = styled(Box)(() => ({
  display: 'flex'
}));

export const PageContainer = styled(Container)(({ theme }) => ({
  height: '100vh'
}));
