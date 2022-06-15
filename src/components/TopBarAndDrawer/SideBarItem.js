import { styled } from '@mui/material';
import { ListItemButton } from '@mui/material';

const SideBarItem = styled(ListItemButton)(() => ({
  paddingLeft: 0,
  borderRadius: '0.4rem',
  flexGrow: 0
}));

export default SideBarItem;
