import { Grow, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSideBar } from './SideBarContext';
import useDevice from '../../hooks/useDevice';

const MainLink = ({ icon, text, to, onClick }) => {
  const { isMobile } = useDevice();
  const { open } = useSideBar();

  return (
    <ListItemButton
      component={to ? 'a' : 'block'}
      href={to ? to : undefined}
      onClick={onClick}
      className="MainLink"
      sx={{
        borderRadius: 1,
        p: 1,
        justifyContent: open ? 'initial' : 'center'
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <Grow in={open} timeout={500}>
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
    </ListItemButton>
  );
};

export default MainLink;
