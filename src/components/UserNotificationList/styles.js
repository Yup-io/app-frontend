import { ListItemButton, styled } from '@mui/material';

export const NotificationItemRoot = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2.5),
  background: `${theme.palette.M900}88`,
  border: `solid 1px ${theme.palette.M750}`,
  borderRadius: theme.shape.borderRadius * 2,
  marginBottom: theme.spacing(2)
}));
