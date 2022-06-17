import React, { Component, Suspense } from 'react';
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
    overflowY: 'scroll',
    borderRadius: "0.65rem"
  },
  notifPopper: {
    maxHeight: '450px',
    overflow: 'scroll'
  },
  notifPaper: {
    overflow: 'hidden',
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

class NotifPopup extends Component {
  state = {
    open: false
  };

  handleToggle = () => {
    const newOpen = !this.state.open;
    this.setState({
      open: newOpen
    });

    if (this.props.notifications[0] && !this.props.notifications[0].seen) {
      this.setNotifsToSeen();
    }
  };

  async setNotifsToSeen() {
    const { notifications, ethAuth } = this.props;

    notifications[0].seen = true;

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

  notifItems() {
    const { notifications, classes } = this.props;

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
          <MenuItem className={classes.menuItem} onClick={this.handleClose}>
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
                onClick={this.handleClose}
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

  render() {
    const { notifications, classes } = this.props;
    let { open } = this.state;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <Downshift
            id="notifications"
            isOpen={this.state.open}
            onOuterClick={() => this.setState({ open: false })}
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
                        onClick={this.handleToggle}
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
                      onClick={this.handleToggle}
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
                        {this.notifItems()}
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
