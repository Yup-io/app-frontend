import { Drawer as MuiDrawer, styled } from '@mui/material';

export const Drawer = styled(MuiDrawer)(({ theme }) => ({
  position: 'fixed',
  width: 170,
  top: theme.spacing(2),
  left: theme.spacing(2),
  bottom: theme.spacing(2),
  padding: theme.spacing(3.5, 1.5),
  background: `${theme.palette.M750}88`,
  border: `solid 1px ${theme.palette.M750}`,
  borderRadius: 12
}));

Drawer.defaultProps = {
  variant: 'persistent'
};
