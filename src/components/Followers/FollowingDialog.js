import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import FollowButton from './FollowButton'
import { levelColors } from '../../utils/colors'
import UserAvatar from '../UserAvatar/UserAvatar'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { fetchSocialLevel } from '../../redux/actions'

const styles = theme => ({
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(1.5)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(),
    top: theme.spacing(),
    color: 'black',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  followButton: {
    margin: theme.spacing()
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  dialogContent: {
    root: {
      margin: 0,
      padding: theme.spacing(2)
    }
  },
  user: {
    display: 'flex',
    padding: '3% 0% 3% 0%',
    paddingTop: '2%',
    alignItems: 'center'
  },
  avatar: {
    height: '30px',
    paddingRight: '5%'
  },
  avatarImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  progress: {
    margin: theme.spacing(2),
    color: '#ffffff'
  },
  text: {
    fontSize: '13px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  }
})

class FollowingDialog extends Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render () {
    const { classes, account, followingInfo, levels, dispatch } = this.props
    const { following } = followingInfo
    const formattedFollowing = numeral(following.length).format('0a').toUpperCase()

    const isLoading = false // TODO: fetch this from Redux
    return (
      <ErrorBoundary>
        <Fragment>
          <Button
            disableRipple
            onClick={this.handleClickOpen}
          >
            <Typography
              align='left'
              variant='body2'
            >
              <a style={{ fontWeight: 700 }}>{formattedFollowing} </a> following
            </Typography>
          </Button>
          <Dialog
            aria-labelledby='customized-dialog-title'
            fullWidth
            maxWidth='xs'
            onClose={this.handleClose}
            open={this.state.open}
          >
            <DialogTitle
              className={classes.dialogTitle}
              disableTypography
              id='customized-dialog-title'
              onClose={this.handleClose}
            >
              <Typography
                align='left'
                variant='h5'
              >
                Following
              </Typography>
              <IconButton
                aria-label='Close'
                className={classes.closeButton}
                disableRipple
                onClick={this.handleClose}
              >
                <CloseIcon style={{ marginTop: '4px', color: '#a0a0a0' }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {
              isLoading
                ? <div align='center'>
                  <CircularProgress className={classes.progress} />
                </div>
                : <Grid container
                    direction='column'
                  > {
                    following.length === 0
                      ? <Typography
                          variant='h5'
                          style={{ textAlign: 'center' }}
                        >
                        No users are being followed
                      </Typography>
                      : following.map((user) => {
                        if (!levels[user._id]) {
                          dispatch(fetchSocialLevel(user._id))
                          return <div />
                       } if (levels[user._id].isLoading) {
                        return <div />
                      }
                        const eosname = user._id
                        const level = levels[eosname]
                        const username = level && level.levelInfo.username
                        const quantile = level && level.levelInfo.quantile
                        let socialLevelColor = levelColors[quantile]

                        return (
                          <Grid item
                            key={user}
                          >
                            <div className={classes.user}>
                              <Grid alignItems='center'
                                container
                                direction='row'
                                justify='space-between'
                              >
                                <Grid item>
                                  <Grid alignItems='center'
                                    container
                                    direction='row'
                                    spacing='16'
                                  >
                                    <Grid item>
                                      <UserAvatar
                                        username={username || eosname}
                                        className={classes.avatarImage}
                                        src={user.avatar}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <Link
                                        onClick={this.handleClose}
                                        style={{ textDecoration: 'none', color: '#ffffff' }}
                                        to={`/${eosname}`}
                                      >
                                        <Typography
                                          style={{
                                            textDecoration: socialLevelColor ? 'underline' : 'none',
                                            textDecorationColor: socialLevelColor,
                                            textDecorationStyle: socialLevelColor ? 'solid' : 'none',
                                            marginLeft: '1rem'
                                          }}
                                          variant='caption'
                                        >
                                          {username || eosname}
                                        </Typography>
                                      </Link>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <FollowButton
                                    account={account}
                                    className={classes.followButton}
                                    eosname={eosname}
                                    isLoggedIn={account && account.name === eosname}
                                  />
                                </Grid>
                              </Grid>
                            </div>
                          </Grid>
                        )
                      })
                  }
                </Grid>
            }
            </DialogContent>
          </Dialog>
        </Fragment>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps

  const twitterIdentity = localStorage.getItem('twitterMirrorInfo')
  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  const { account: ethAccount } = state.ethAuth
  let account = scatterIdentity || state.ethAccount

  if (!scatterIdentity) {
    if (ethAccount) {
      account = { name: ethAccount._id, authority: 'active' }
    } else if (twitterIdentity) {
      account = { name: JSON.parse(twitterIdentity).name, authority: 'active' }
    }
  }

  if (account && state.userPermissions && state.userPermissions[account.name]) {
    account.authority = state.userPermissions[account.name].perm
  }

  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    followingInfo: state.followingByUser[username] || {
      isLoading: true,
      following: [],
      error: false
    }
  }
}

FollowingDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  levels: PropTypes.object,
  followingInfo: PropTypes.object.isRequired,
  account: PropTypes.object
}

export default connect(mapStateToProps)(withStyles(styles)(FollowingDialog))
