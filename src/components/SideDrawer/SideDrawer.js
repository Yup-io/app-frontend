import React from 'react'
import PropTypes from 'prop-types'
import Drawer from '@material-ui/core/Drawer'
import { List, ListItem, ListItemIcon, Fab } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import SquareIcon from '@material-ui/icons/Unarchive'
import HelpOutlined from '@material-ui/icons/HelpOutlined'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { Link } from 'react-router-dom'

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: '.25%',
    display: 'none', // removed for now
    maxWidth: '20px',
    flexShrink: 4,
    overflow: 'visible',
    zIndex: '-200',
    top: '-50px',
    background: 'transparent',
    color: 'white',
    borderRight: '4px solid #000000',
    paperAnchorDockedLeft: {
      borderRight: '4px solid'
    },
    marginLeft: '100px',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  drawerPaper: {
    width: '350px',
    maxWidth: '15%',
    minWidth: 0,
    borderRight: '0px solid',
    overflow: 'hidden',
    marginLeft: '7%',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 0
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0%'
    }
  },
  list1: {
    background: 'transparent',
    border: '0px solid #e6e6e6',
    marginLeft: '14%',
    textColor: 'white',
    fontWeight: 100
  },
  list2: {
    background: 'transparent',
    textColor: 'white',
    marginLeft: '14%',
    fontWeight: 100,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  ListSubheader: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  item1: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  tourFab: {
    background: '#00E08E'
  }
})

const SideDrawer = ({ classes }) => {
  return (
    <ErrorBoundary>
      <div>
        <Drawer
          classes={{ paper: classes.drawerPaper }}
          className={classes.drawer}
          position='absolute'
          style={{ fontWeight: 100 }}
          variant='permanent'
        >
          <div className={classes.toolbar}
            style={{ marginLeft: '10vw', fontWeight: 100 }}
          />
          <List className={classes.list1}>
            <ListItem button
              component={Link}
              to='/leaderboard'
            >
              <ListItemIcon>
                <SquareIcon style={{ color: '#c0c0c0' }} />
              </ListItemIcon>
              <ListItemText inset>
                <span className={classes.typography}
                  style={{ color: '#c0c0c0', fontWeight: 100 }}
                > Lists
                </span>
              </ListItemText>
            </ListItem>
            <a href='https://docs.yup.io'
              style={{ textDecoration: 'none' }}
              target='_blank'
            >
              <ListItem button>
                <ListItemIcon>
                  <HelpOutlined style={{ color: '#c0c0c0' }} />
                </ListItemIcon>
                <ListItemText inset>
                  <span className={classes.typography}
                    style={{ color: '#c0c0c0' }}
                  > Tutorial
                  </span>
                </ListItemText>
              </ListItem>
            </a>
            <ListItem button>
              <Fab
                className={classes.tourFab}
                variant='extended'
              >10-Second Tutorial
              </Fab>
            </ListItem>
          </List>
        </Drawer>
      </div>
    </ErrorBoundary>
  )
}

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SideDrawer)
