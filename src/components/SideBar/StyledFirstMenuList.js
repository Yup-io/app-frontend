import React from 'react'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Grow
} from '@mui/material'
import PrivateListItem from './PrivateListItem'

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
})

export const StyledFirstMenuList = withStyles(styles)(
  function FirstMenuList ({
    classes,
    handleDrawerClose,
    Link
  }) {
    const { palette } = useTheme()

    return (
      <Grow in
        timeout={500}
      >
        <List
          component='nav'
          aria-label='secondary'
          className={classes.list1}
          tourname='FeedsDrawer'
          dense='true'
        >
          <ListSubheader
            style={{
              color: palette.common.fifth,
              fontWeight: '500'
            }}
          >
            Feeds
          </ListSubheader>
          <div style={{ maxHeight: 120, overflowY: 'scroll' }}>
            <PrivateListItem>
              <ListItem
                className={classes.listItem}
                button
                dense
                component={Link}
                onClick={handleDrawerClose}
                to='/?feed=dailyhits'
              >
                <ListItemText
                  primary='Your Daily Hits'
                  className={classes.listButton}
                />
              </ListItem>
            </PrivateListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=crypto'
            >
              <ListItemText primary='Crypto'
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=nfts'
            >
              <ListItemText primary='NFTs'
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=mirror'
            >
              <ListItemText
                primary='Mirror Articles'
                style={{ margin: 0 }}
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=politics'
            >
              <ListItemText primary='Politics'
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=non-corona'
            >
              <ListItemText primary='Safe Space'
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=latenightcool'
            >
              <ListItemText primary='Popular'
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=lol'
            >
              <ListItemText primary='Funny'
                className={classes.listButton}
              />
            </ListItem>
            <ListItem
              className={classes.listItem}
              button
              dense
              component={Link}
              onClick={handleDrawerClose}
              to='/?feed=brainfood'
            >
              <ListItemText primary='Smart'
                className={classes.listButton}
              />
            </ListItem>
          </div>
        </List>
      </Grow>
    )
  })
