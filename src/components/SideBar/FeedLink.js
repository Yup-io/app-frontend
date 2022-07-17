import { ListItemText } from '@mui/material';
import { MenuItemButton } from './styles';
import Link from '../Link';

const FeedLink = ({ category, text }) => {
  return (
    <MenuItemButton
      component={Link}
      href={`/feed/${category}`}
      className="FeedLink"
      sx={{
        py: 0
      }}
    >
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: 'bodyS2',
          color: (theme) => theme.palette.M500
        }}
      />
    </MenuItemButton>
  );
};

export default FeedLink;
