import React from 'react';
import { useTheme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import { List, ListItemText, ListSubheader, Grow } from '@mui/material';
import { useRouter } from 'next/router';
import PrivateListItem from './PrivateListItem';
import SideBarItem from './SideBarItem';

const styles = () => ({
  list1: {
    background: 'transparent',
    border: '0px solid #e6e6e6'
  },
  listItem: {
    borderRadius: '0.4rem'
  },
  listInfoLinks: {
    color: '#888888'
  },
  listButton: {
    opacity: 0.6,
    fontWeight: '300',
    margin: 0,
    '&:hover': {
      opacity: 1
    }
  }
});

const NavItems = [
  {
    text: 'Crypto',
    path: 'crypto'
  },
  {
    text: 'NFTs',
    path: 'nfts'
  },
  {
    text: 'Mirror Articles',
    path: 'mirror'
  },
  {
    text: 'Politics',
    path: 'politics'
  },
  {
    text: 'Safe Space',
    path: 'non-corona'
  },
  {
    text: 'Popular',
    path: 'latenightcool'
  },
];

export const StyledFirstMenuList = withStyles(styles)(function FirstMenuList({
  classes,
  handleDrawerClose
}) {
  const { palette } = useTheme();
  const router = useRouter();

  const handleNavigate = (path) => {
    handleDrawerClose();
    router.push(path);
  };

  return (
    <Grow in timeout={500}>
      <List
        component="nav"
        aria-label="secondary"
        className={classes.list1}
        tourname="FeedsDrawer"
        dense
      >
        <ListSubheader
          style={{
            color: palette.common.fifth,
            fontWeight: '500',
            backgroundColor: 'transparent'
          }}
        >
          Feeds
        </ListSubheader>
        <div style={{ maxHeight: 120, overflowY: 'scroll' }}>
          <PrivateListItem>
            <SideBarItem
              dense
              onClick={() => handleNavigate('/feed/dailyhits')}
              sx={{ paddingLeft: '12px!important' }}
            >
              <ListItemText
                primary="Your Daily Hits"
                className={classes.listButton}
              />
            </SideBarItem>
          </PrivateListItem>
          {NavItems.map((item) => (
            <SideBarItem
              key={item.text}
              dense
              onClick={() => handleNavigate(`/feed/${item.path}`)}
              sx={{ paddingLeft: '12px!important' }}
            >
              <ListItemText
                primary={item.text}
                className={classes.listButton}
              />
            </SideBarItem>
          ))}
        </div>
      </List>
    </Grow>
  );
});
