import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Grow, IconButton, Badge, Icon } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import wallet from '../../eos/scatter/scatter.wallet.js'
import Downshift from 'downshift'
import axios from 'axios'
import { connect } from 'react-redux'
import NotifOutline from './NotifOutline'
import { ethAuthSelector } from '../../redux/selectors'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
const Notification = React.lazy(() => import('./Notification'))

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
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
    overflowY: 'scroll'
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
  }
})

class NotifPopup extends Component {
  state = {
    open: false
  }

  handleToggle = () => {
    const newOpen = !this.state.open
    this.setState({
      open: newOpen
    })

    if (this.props.notifications[0] && !this.props.notifications[0].seen) {
      this.setNotifsToSeen()
    }
  }

  async setNotifsToSeen () {
    const { notifications, ethAuth } = this.props

    notifications[0].seen = true

    if (!ethAuth) {
      const { signature, eosname } = await wallet.scatter.getAuthToken()
      notifications.forEach(async (notif) => {
        const id = notif._id
        const res = await axios.post(`${BACKEND_API}/notifications/seen/`, { id, signature, eosname })
        if (res.error) {
          console.error(res.message, 'ERROR SETTING NOTIF TO SEEN')
        }
      })
    } else {
      const { signature, address } = ethAuth
      notifications.forEach(async (notif) => {
        const id = notif._id
        const res = await axios.post(`${BACKEND_API}/notifications/eth-mirror/seen/`, { id, signature, address })
        if (res.error) {
          console.error(res.message, 'ERROR SETTING NOTIF TO SEEN')
        }
      })
    }
  }

  notifItems () {
    const { notifications, classes } = this.props

    if (notifications.length === 0) {
      return (
        <MenuList className={classes.menuList}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75px'
          }}
        >
          <MenuItem className={classes.menuItem}
            onClick={this.handleClose}
          >
            <p>No notifications found</p>
          </MenuItem>
        </MenuList>
      )
    } else {
      return (
        <MenuList className={classes.menuList}>
          {notifications.map((notif, i) => {
            return (
              <MenuItem className={classes.menuItem}
                key={i}
                onClick={this.handleClose}
              >
                <Suspense fallback={<NotifOutline />}>
                  <Notification notif={notif} />
                </Suspense>
              </MenuItem>
            )
          })}
        </MenuList>
      )
    }
  }

  render () {
    const { notifications, classes } = this.props
    let { open } = this.state

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <Downshift
            id='notifications'
            isOpen={this.state.open}
            onOuterClick={() => this.setState({ open: false })}
          >
            {({
              getButtonProps,
              getMenuProps,
              isOpen
            }) => (
              <div>
                <div >
                  {notifications[0] && !notifications[0].seen
                    ? <Badge variant='dot'>
                      <IconButton
                        variant='fab'
                        aria-controls='menu-list-grow'
                        aria-haspopup='true'
                        className={classes.notifButton}
                        onClick={this.handleToggle}
                      >
                        <Badge
                          color='error'
                          variant='dot'
                          overlap='circle'
                          badgeContent=' '
                        >
                          <Icon fontSize='small'
                            className='fal fa-bell'
                          />
                        </Badge>
                      </IconButton>
                    </Badge>
                    : <IconButton
                      variant='fab'
                      aria-controls='menu-list-grow'
                      aria-haspopup='true'
                      className={classes.notifButton}
                      onClick={this.handleToggle}
                    >
                      <Icon fontSize='small'
                        className='fal fa-bell'
                      />
                    </IconButton>
                  }
                </div>
                <div className={classes.wrapper}
                  style={open ? {
                  } : null}
                  {...getMenuProps()}
                >
                  {isOpen
                    ? <Grow in
                      timeout={500}
                    >
                      <Paper className={classes.notifPaper}
                        id='menu-list-grow'
                      >
                        {this.notifItems()}
                      </Paper>
                    </Grow>
                    : null}
                </div>
              </div>
            )}
          </Downshift>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const ethAuth = ethAuthSelector(state)
  return {
    ethAuth
  }
}

NotifPopup.propTypes = {
  ethAuth: PropTypes.object,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(NotifPopup))
