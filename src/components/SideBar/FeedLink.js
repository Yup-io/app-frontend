import { ListItemButton, ListItemText } from '@mui/material';

const FeedLink = ({ category, text }) => {
  return (
    <ListItemButton
      component="a"
      href={`/feed/${category}`}
      sx={{
        px: 1,
        py: 0,
        borderRadius: 1
      }}
    >
      <ListItemText
        primary={text}
        primaryTypographyProps={{
          variant: 'bodyS2',
          color: (theme) => theme.palette.M500
        }}
      />
    </ListItemButton>
  );
};

export default FeedLink;
