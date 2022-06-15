import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActionIcon = ({ icon, onClick }) => (
  <IconButton onClick={onClick}>
    <FontAwesomeIcon icon={icon} />
  </IconButton>
);

export default ActionIcon;
