import React from 'react'
import PropTypes from 'prop-types'
import { MuiThemeProvider, createMuiTheme, withStyles } from '@material-ui/core/styles'
import { Card } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import UserAvatar from '../UserAvatar/UserAvatar'
import Grid from '@material-ui/core/Grid'
import lightBlue from '@material-ui/core/colors/lightBlue'
import FollowButton from '../Followers/FollowButton'
import EditProfile from '../EditProfile/EditProfile'
import FollowersDialog from '../Followers/FollowersDialog'
import FollowingDialog from '../Followers/FollowingDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { levelColors } from '../../utils/colors'
import numeral from 'numeral'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'
import LinesEllipsis from 'react-lines-ellipsis'
import CountUp from 'react-countup'

const styles = theme => ({
  avatarImage: {
    width: 100 - theme.spacing(),
    height: 100 - theme.spacing(),
    minHeight: 100 - theme.spacing(),
    minWidth: 100 - theme.spacing(),
    fontSize: '60px',
    marginTop: '0px',
    marginBottom: '-4px',
    borderRadius: '100%',
    border: 'solid 3px #DADADA',
    position: 'absolute',
    [theme.breakpoints.down('xs')]: {
      fontSize: '45px',
      marginLeft: '15px',
      marginBottom: '6vw',
      borderRadius: '100%',
      width: '60px',
      height: '60px',
      minHeight: '60px',
      minWidth: '60px'
    }
  },
  bio: {
    color: '#AAAAAA',
    fontSize: '12px',
    padding: '0px',
    marginTop: theme.spacing(1),
    fontFamily: 'Gilroy',
    fontWeight: '100',
    display: 'inherit',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      display: 'none'
    }
  },
  card: {
    paddingTop: theme.spacing(-10),
    paddingBottom: theme.spacing(-10),
    boxShadow: '0px 0px 0px #2a2a2a81',
    background: 'transparent',
    backgroundSize: 'cover',
    width: '600px',
    margin: 'auto',
    marginTop: '75px',
    maxWidth: '100vw',
    maxHeight: '225px',
    position: 'relative',
    [theme.breakpoints.down('lg')]: {
      margin: '75px 0px 0px 30px'
    },
    [theme.breakpoints.down('xs')]: {
      margin: 'auto',
      marginTop: theme.spacing(10),
      height: '175px',
      width: '100vw'
    }
  },
  content: {
    color: 'black'
  },
  eos: {
    display: 'none'
  },
  hidden: {
    display: 'none'
  },
  largeStat: {
    color: '#ffffff',
    fontSize: '24px',
    padding: '0px',
    fontFamily: 'Gilroy',
    fontWeight: '500',
    marginRight: '5px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '22px',
      width: '2rem'
    }
  },
  LinearProgress: {
    height: '3px'
  },
  minimize: {
    width: '45px',
    height: '45px',
    minWidth: '45px',
    minHeight: '45px',
    fontSize: '18px',
    [theme.breakpoints.down('xs')]: {
      width: '35px',
      height: '35px',
      minWidth: '35px',
      minHeight: '35px',
      fontSize: '14px'
    }
  },
  minimizeCard: {
    maxHeight: '55px',
    transition: 'max-height 0.2s linear',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '45px'
    }
  },
  name: {
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: '500',
    padding: '0px',
    fontFamily: 'Gilroy',
    [theme.breakpoints.down('xs')]: {
      fontSize: '20px'
    }
  },
  profileDetails: {
    ...theme.mixins.gutters(),
    paddingBottom: theme.spacing(1),
    boxShadow: 'none',
    maxHeight: '250px',
    height: '140px',
    display: 'inline-grid',
    width: '100%',
    position: 'relative',
    marginLeft: '100px',
    [theme.breakpoints.down('xs')]: {
      paddingTop: '10px',
      marginLeft: '90px',
      display: 'block',
      height: '100px'
    }
  },
  profileStats: {
    marginLeft: '0px',
    padding: '0px 0rem',
    width: '100%',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      padding: '0px 2rem 0px calc(2rem - 12px)'
    }
  },
  text: {
    color: '#ffffff',
    fontSize: '12px',
    padding: '0px',
    fontFamily: 'Gilroy',
    fontWeight: '100',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  },
  text2: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '500',
    fontFamily: 'Gilroy',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  },
  username: {
    color: '#ffffff',
    fontSize: '18px',
    padding: '0px',
    fontFamily: 'Gilroy',
    fontWeight: '100',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    }
  }
})

const theme = createMuiTheme({
  palette: {
    primary: { main: '#ffffff' },
    secondary: { main: '#ffffff' },
    third: lightBlue
  },
  button: {
    width: 16,
    height: 16,
    padding: 5,
    color: '#ffffff'
  },
  icon: {
    width: 25,
    height: 25,
    color: 'primary'
  },
  stats: {
    fontFamily: 'Gilroy',
    color: 'white'
  }
})

function formatBio (bio = '') {
  if (!bio) { return '' }
  if (bio.length > 120) {
    return bio.slice(0, 120) + '...'
  }
  return bio
}

function ProfileCard (props) {
  const { classes, balanceInfo, account, accountInfo, isLoggedIn, ratingCount, isMinimize, level } = props
  const YUPBalance = (balanceInfo && balanceInfo.YUP) || 0
  const YUPBalanceError = (balanceInfo && balanceInfo.YUP && balanceInfo.YUP.error) || null

  const formattedYUPBalance = YUPBalance && numeral(Number(YUPBalance)).format('0,0.00')
  const formattedWeight = numeral(Math.floor(Number(accountInfo.weight))).format('0,0')
  const formattedRatings = numeral(ratingCount).format('0a').toUpperCase()

  const quantile = level && level.levelInfo.quantile
  const socialLevelColor = levelColors[quantile]

  const displayName = accountInfo.fullname || accountInfo.username || accountInfo._id
  const isMirror = accountInfo && accountInfo.twitterInfo && accountInfo.twitterInfo.isMirror
  const isAuthUser = accountInfo && accountInfo.twitterInfo && accountInfo.twitterInfo.isAuthUser
  const defaultUsername = accountInfo.username || accountInfo._id
  const username = isMirror ? accountInfo.twitterInfo.username : defaultUsername

  const hidden = isMinimize ? classes.hidden : null
  const minimize = isMinimize ? classes.minimize : null
  const minimizeCard = isMinimize ? classes.minimizeCard : null
  // const isMobile = window.innerWidth <= 600

  return (
    <ErrorBoundary>
      <Card className={`${classes.card} ${minimizeCard}`}
        tourname='ProfileUsername'
      >
        <UserAvatar
          alt={accountInfo._id}
          username={accountInfo.eosname}
          className={`${classes.avatarImage} ${minimize}`}
          src={level.levelInfo.avatar}
          style={{ border: `solid 3px ${socialLevelColor}` }}
        />
        <Grid
          alignItems='center'
          container
          direction='row'
          justify='left'
        >
          <Grid item
            className={classes.profileDetails}
            style={{ paddingTop: isMinimize ? '5px' : '' }}
          >
            <Grid alignItems='flex-start'
              container
              direction='row'
              justify='space-between'
              spacing={0}
            >
              <Grid item
                sm={10}
                xs={9}
              >
                <Typography align='left'
                  className={classes.name}
                  color='inherit'
                  display='inline'
                  variant='h3'
                >
                  <LinesEllipsis
                    basedOn='letters'
                    ellipsis='...'
                    maxLine='4'
                    text={displayName}
                    trimRight
                  />
                </Typography>
              </Grid>
              <Grid item
                sm={2}
                xs={3}
              >
                {isLoggedIn
                  ? <MuiThemeProvider theme={theme}>
                    <EditProfile
                      accountInfo={accountInfo}
                      className={classes.button}
                      username={username}
                      size='small'
                      variant='outlined'
                    />
                  </MuiThemeProvider>
                  : <FollowButton
                    account={account}
                    eosname={accountInfo.eosname}
                    isLoggedIn={isLoggedIn}
                    />
              }
              </Grid>
            </Grid>

            <Typography align='left'
              variant='h5'
              className={`${classes.username} ${hidden}`}
            >
              <Grid container
                direction='row'
                spacing={0}
              >
                <Grid item>
                  <span style={{
                    textDecoration: socialLevelColor ? 'none' : 'none',
                    textDecorationColor: socialLevelColor,
                    textDecorationStyle: socialLevelColor ? 'solid' : 'none',
                    fontWeight: isMirror ? '200' : '200',
                    color: isMirror ? '#b1b1b1' : '#ffffff',
                    padding: '0px'
                  }}
                  >
                    @{username}
                  </span>
                </Grid>
                <Grid item>
                  {(isMirror && !isAuthUser)
                    ? <Tooltip enterDelay={200}
                      disableTouchListener
                      title="This account is a mirror of this Twitter user's activity"
                      >
                      <img
                        src='/images/icons/twitter.svg'
                        style={{ height: '20px', paddingLeft: '15px', marginTop: '1px' }}
                      />
                    </Tooltip>
                    : null
                  }
                </Grid>
              </Grid>
            </Typography>
            <Typography align='left'
              className={classes.bio}
              color='inherit'
              nowrap
              style={{ wordWrap: 'break-word' }}
              variant='body2'
            >
              <LinesEllipsis
                basedOn='letters'
                ellipsis='...'
                maxLine='2'
                text={formatBio(accountInfo.bio)}
                className={hidden}
                trimRight
              />
            </Typography>
          </Grid>

          <Grid alignItems='baseline'
            alignContent='center'
            container
            direction='row'
            justify='end'
            spacing={3}
            className={`${classes.profileStats} ${hidden}`}
          >
            <Grid item
              xs={6}
              sm={3}
              md={3}
            >
              <Tooltip
                placement='bottom'
                disableTouchListener
                title={<h color='#fff'
                  style={{ fontSize: '12px' }}
                       >Influence Score: score out of 100 showing how influential you are. The higher the number, the more valuable your rating!</h>}
              >
                <div
                  tourname='Influence'
                >
                  <Typography
                    className={classes.largeStat}
                    style={{ display: 'inline-block', fontFamily: 'Gilroy', color: socialLevelColor }}
                    variant='caption'
                  >
                    <CountUp end={`${formattedWeight}`}
                      duration={2}
                      useEasing={false}
                    />
                  </Typography>
                  <Typography className={classes.text}
                    style={{ display: 'inline-block', fontFamily: 'Gilroy', fontSize: '12px' }}
                  >
                    Influence
                  </Typography>
                </div>
              </Tooltip>
            </Grid>
            <Grid item
              xs={6}
              sm={3}
              md={3}
            >
              <Tooltip
                placement='bottom'
                disableTouchListener
                title={<h color='#fff'
                  style={{ fontSize: '12px' }}
                       > Amount of YUP held by user</h>}
              >
                {
                  YUPBalanceError
                    ? ''
                    : <Typography
                      className={classes.text2}
                      color='inherit'
                      style={{ display: 'inline-block', fontFamily: 'Gilroy' }}
                      variant='caption'
                      tourname='YUPBalance'
                      >
                      <Grid container
                        direction='row'
                        alignItems='flex-end'
                        spacing={1}
                      >
                        <Grid item>
                          <img
                            src='/images/logos/logo_outline_w.svg'
                            style={{ width: '15px', height: '15px' }}
                          />
                        </Grid>
                        <Grid item>
                          {YUPBalanceError ? 0 : formattedYUPBalance}
                        </Grid>
                      </Grid>
                    </Typography>
                }
              </Tooltip>
            </Grid>
          </Grid>
          <Grid alignItems='center'
            container
            direction='row'
            justify='start'
            spacing={3}
            className={`${classes.profileStats} ${hidden}`}
          >
            <Grid item>
              <Typography align='left'
                className={classes.text}
                color='inherit'
              >
                <a style={{ fontWeight: 500 }}>{formattedRatings}</a> Ratings
              </Typography>
            </Grid>
            <Grid item>
              <FollowersDialog
                account={account}
                className={classes.text}
                isLoggedIn={isLoggedIn}
                username={accountInfo._id}
              />
            </Grid>
            <Grid item>
              <FollowingDialog account={account}
                className={classes.text}
                isLoggedIn={isLoggedIn}
                username={accountInfo._id}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </ErrorBoundary>
  )
}
const mapStateToProps = (state, ownProps) => {
  const eosname = ownProps.accountInfo && ownProps.accountInfo.eosname
  return {
    level: state.socialLevels.levels[eosname] || {
      isLoading: true,
      error: false,
      levelInfo: {}
    }
  }
}

ProfileCard.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  ratingCount: PropTypes.number.isRequired,
  balanceInfo: PropTypes.object.isRequired,
  accountInfo: PropTypes.object.isRequired,
  isMinimize: PropTypes.bool.isRequired,
  level: PropTypes.object,
  account: PropTypes.object
}

export default connect(mapStateToProps)(withStyles(styles)(ProfileCard))
