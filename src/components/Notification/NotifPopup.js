import React, { Component, Suspense, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { Paper, Grow, IconButton, Badge, Icon } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import wallet from '../../eos/scatter/scatter.wallet.js';
import Downshift from 'downshift';
import axios from 'axios';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-light-svg-icons';
import NotifOutline from './NotifOutline';
import { ethAuthSelector } from '../../redux/selectors';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { apiBaseUrl } from '../../config';
const Notification = React.lazy(() => import('./Notification'));

const styles = (theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'auto',
      maxHeight: 'auto'
    }
  },
  notifButton: {
    color: 'black'
  },
  wrapper: {
    position: 'absolute',
    right: '23px',
    width: '350px',
    maxHeight: '80vh',
    overflowY: 'hidden',
    borderRadius: "0.65rem"
  },
  notifPopper: {
    maxHeight: '450px',
    overflow: 'scroll'
  },
  notifPaper: {
    overflowY: 'scroll',
    maxHeight: '80vh',
    borderRadius: 12,
    backgroundColor: `${theme.palette.M700}cc`,
    backdropFilter: 'blur(20px)'
  },
  menuList: {
    padding: 0,
    margin: 0
  },
  menuItem: {
    padding: 0
  },
  iconColor: {
    color: theme.palette.M100
  }
});

const NotifPopup = ({notifications, ethAuth, classes}) => {
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen(prev=> !prev)
 

    if (notifications[0] && !notifications[0].seen) {
      setNotifsToSeen();
    }
  };
  const handleClose = () =>{
    setOpen(false)
  }
  
  const setNotifsToSeen = async()=> {

    notifications[0].seen = true;
    if(notifications[0].type==='ethaddressmissing') {

      localStorage.setItem('sawEthNotfication', new Date().getTime())
    }
    if (!ethAuth) {
      const { signature, eosname } = await wallet.scatter.getAuthToken();
      notifications.forEach(async (notif) => {
        const id = notif._id;
        const res = await axios.post(`${apiBaseUrl}/notifications/seen/`, {
          id,
          signature,
          eosname
        });
        if (res.error) {
          console.error(res.message, 'ERROR SETTING NOTIF TO SEEN');
        }
      });
    } else {
      const { signature, address } = ethAuth;
      notifications.forEach(async (notif) => {
        const id = notif._id;
        const res = await axios.post(
          `${apiBaseUrl}/notifications/eth-mirror/seen/`,
          { id, signature, address }
        );
        if (res.error) {
          console.error(res.message, 'ERROR SETTING NOTIF TO SEEN');
        }
      });
    }
  }

  const notifItems = () => {

    if (notifications.length === 0) {
      return (
        <MenuList
          className={classes.menuList}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75px'
          }}
        >
          <MenuItem className={classes.menuItem} onClick={handleClose}>
            <p>No notifications found</p>
          </MenuItem>
        </MenuList>
      );
    } else {
      return (
        <MenuList className={classes.menuList}>
          {notifications.map((notif, i) => {
            return (
              <MenuItem
                className={classes.menuItem}
                key={i}
                onClick={handleClose}
              >
                <Suspense fallback={<NotifOutline />}>
                  <Notification notif={notif} />
                </Suspense>
              </MenuItem>
            );
          })}
        </MenuList>
      );
    }
  }


    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <Downshift
            id="notifications"
            isOpen={open}
            onOuterClick={() => setOpen(false)}
          >
            {({ getButtonProps, getMenuProps, isOpen }) => (
              <div>
                <div>
                  {notifications[0] && !notifications[0].seen ? (
                    <Badge variant="dot">
                      <IconButton
                        variant="fab"
                        aria-controls="menu-list-grow"
                        aria-haspopup="true"
                        className={classes.notifButton}
                        onClick={handleToggle}
                        size="small"
                      >
                        <Badge
                          color="error"
                          variant="dot"
                          overlap="circular"
                          badgeContent=" "
                        >
                          <FontAwesomeIcon
                            icon={faBell}
                            className={classes.iconColor}
                          />
                        </Badge>
                      </IconButton>
                    </Badge>
                  ) : (
                    <IconButton
                      variant="fab"
                      aria-controls="menu-list-grow"
                      aria-haspopup="true"
                      className={classes.notifButton}
                      onClick={handleToggle}
                      size="small"
                    >
                      <FontAwesomeIcon
                        icon={faBell}
                        className={classes.iconColor}
                      />
                    </IconButton>
                  )}
                </div>
                <div
                  className={classes.wrapper}
                  style={open ? {} : null}
                  {...getMenuProps()}
                >
                  {isOpen ? (
                    <Grow in timeout={500}>
                      <Paper className={classes.notifPaper} id="menu-list-grow">
                        {notifItems()}
                      </Paper>
                    </Grow>
                  ) : null}
                </div>
              </div>
            )}
          </Downshift>
        </div>
      </ErrorBoundary>
    );
  }


const mapStateToProps = (state, ownProps) => {
  const ethAuth = ethAuthSelector(state);
  return {
    ethAuth
  };
};

NotifPopup.propTypes = {
  ethAuth: PropTypes.object,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(NotifPopup));
