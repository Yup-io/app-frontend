import { Grow, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSideBar } from './SideBarContext';
import useDevice from '../../hooks/useDevice';
import { MENU_ANIMATION_DURATION } from '../../constants/const';
import { MenuItemButton } from './styles';
import Link from '../Link';

const MainLink = ({ icon, text, to, onClick }) => {
  const { isMobile } = useDevice();
  const { open } = useSideBar();

  return (
    <MenuItemButton
      onClick={onClick}
      className="MainLink"
      component={to ? Link : 'div'}
      href={to}
      sx={{ justifyContent: open ? 'initial' : 'center' }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <Grow in={open} timeout={MENU_ANIMATION_DURATION}>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            variant: isMobile ? 'h6' : 'bodyS2'
          }}
          sx={{
            ml: 1,
            display: open ? 'block' : 'none'
          }}
        />
      </Grow>
    </MenuItemButton>
  );
};

export default MainLink;