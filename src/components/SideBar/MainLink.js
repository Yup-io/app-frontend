import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MainLink = ({ icon, text, to, onClick }) => {
  return (
    <ListItemButton
      component={to ? 'a' : 'block'}
      href={to ? to : undefined}
      onClick={onClick}
      className="MainLink"
      sx={{
        borderRadius: 1,
        p: 1,
        justifyContent: 'initial'
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{ ml: 1 }}
        primaryTypographyProps={{
          variant: 'bodyS2'
        }}
      />
    </ListItemButton>
  );
};

export default MainLink;
