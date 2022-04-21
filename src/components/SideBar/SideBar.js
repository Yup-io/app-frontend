import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toggleColorTheme } from '../../redux/actions'
import {
  AppBar,
  ListItemAvatar,
  Button,
  Toolbar,
  IconButton,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Icon,
  ListItemIcon,
  Typography,
  Badge,
  Grow
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import { Link } from 'react-router-dom'
import { useSelector, connect } from 'react-redux'
import SearchBar from '../SearchBar/SearchBar'
import YupListSearchBar from '../YupLeaderboard/YupListSearchBar'
import { orange as Orange } from '@mui/material/colors'
import NotifPopup from '../Notification/NotifPopup'
import { levelColors } from '../../utils/colors'
import { withRouter } from 'react-router'
import CollectionDialog from '../Collections/CollectionDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import numeral from 'numeral'
import { accountInfoSelector } from '../../redux/selectors'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import { StyledYupProductNav } from './StyledYupProductNav'
import { StyledProfileAvatar } from './StyledProfileAvatar'
import { StyledFirstMenuList } from './StyledFirstMenuList'
import { StyledSecondMenuList } from './StyledSecondMenuList'
import { StyledSettingsModal } from './StyledSettingsModal'
import AuthModal from '../../features/AuthModal'

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props}
  width='xs' />

const drawerWidth = 200
const { BACKEND_API } = process.env

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 5,
    boxShadow: `0 0 0 ${theme.palette.common.first}`,
    borderBottom: `0 solid ${theme.palette.common.first}`,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    background: 'transparent'
  },
  topButtons: {
    container1: {
      [theme.breakpoints.down('sm')]: {
        justify: 'center'
      }
    }
  },
  signupBtn: {
    backgroundColor: theme.palette.alt.second,
    fontFamily: 'Gilroy',
    width: '100%',
    height: 45,
    borderRadius: '0.65rem',
    '&:hover': {
      backgroundColor: levelColors.first
    },
    [theme.breakpoints.down('md')]: {
      height: 40,
      fontSize: 12
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  searchMobile: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'contents'
    }
  },
  search: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  drawer: {
    flexShrink: 4,
    paperAnchorDockedLeft: {
      borderRight: '4px solid'
    },
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0
    },
    overflowX: 'hidden'
  },
  drawerPaperOpen: {
    height: `calc(100vh - ${theme.spacing(2)})`,
    borderRight: '0 solid',
    backdropFilter: 'blur(15px)',
    overflowX: 'hidden',
    margin: `${theme.spacing(1)} 0 ${theme.spacing(1)} ${theme.spacing(
      1
    )}px`,
    backgroundColor: `${theme.palette.alt.second}88`,
    borderRadius: '0.65rem',
    maxWidth: 200,
    zIndex: 1000,
    padding: `0 ${theme.spacing(1)}`,
    transition: 'max-width 3s',
    'transition-timing-function': 'ease-in'
  },
  drawerPaperMini: {
    height: `calc(100vh - ${theme.spacing(2)})`,
    borderRight: '0 solid',
    backdropFilter: 'blur(0)',
    overflowX: 'hidden',
    margin: `${theme.spacing(1)} 0 ${theme.spacing(1)} ${theme.spacing(
      1
    )}px`,
    backgroundColor: `${theme.palette.alt.second}00`,
    borderRadius: '0.65rem',
    maxWidth: 200,
    zIndex: 1000,
    padding: `0 ${theme.spacing(1)}`,
    transition: 'max-width 3s',
    'transition-timing-function': 'ease-in'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    color: Orange
  },
  listItem: {
    borderRadius: '0.4rem'
  },
  menuButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  icons: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      marginRight: '0%'
    }
  },
  notifWrap: {
    width: 44,
    [theme.breakpoints.down('sm')]: {
      width: 'auto'
    }
  }
})

const getReduxState = state => {
  const account = accountInfoSelector(state)
  return {
    account
  }
}

const defaultLevelInfo = {
  isLoading: true,
  error: false,
  levelInfo: {}
}

function SideBar ({ classes, history, width, isTourOpen, lightMode, toggleTheme }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [account, setAccount] = useState(null)
  const [isShown, setIsShown] = useState(isMobile || isTourOpen || false)
  const [notifications, setNotifications] = useState([])
  const [level, setLevel] = useState(defaultLevelInfo)
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(null)
  let authInfo = useSelector(getReduxState)
  const accountName = authInfo && authInfo.account && authInfo.account.name

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const dialog = params.get('signupOpen')
    const collectionDialog = params.get('collectionDialogOpen')
    setCollectionDialogOpen(collectionDialog || false)
    setDialogOpen((!accountName && dialog) || false)
    authInfo.account.name && setAccount(authInfo.account)
    fetchNotifs()
  }, [accountName])

  useEffect(() => {
    if (authInfo && authInfo.account && authInfo.account.name) {
      axios
        .get(`${BACKEND_API}/levels/user/${authInfo.account.name}`)
        .then(res => {
          const levelInfo = res.data
          setLevel({
            isLoading: false,
            error: false,
            levelInfo
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [accountName])

  useEffect(() => {
    window.addEventListener('resize', setIsMobile(window.innerWidth <= 480))
    return window.removeEventListener(
      'resize',
      setIsMobile(window.innerWidth <= 480)
    )
  })

  const fetchNotifs = () => {
    if (!accountName || notifications.length) {
      return
    }
    try {
      axios
        .get(`${BACKEND_API}/notifications/${accountName}`)
        .then(({ data: notifs }) => {
          setNotifications(notifs.reverse())
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (isTourOpen === undefined) {
      return
    }
    setIsShown(isTourOpen)
  }, [isTourOpen])

  const handleDrawerOpen = () => {
    setIsShown(true)
    setOpen(true)
  }

  const handleDialogOpen = () => setDialogOpen(true)
  const handleCollectionDialogClose = () => setCollectionDialogOpen(false)
  const handleDrawerClose = () => setOpen(false)
  const handleSettingsOpen = () => setSettingsOpen(true)
  const handleSettingsClose = () => setSettingsOpen(false)

  const handleDialogClose = () => {
    setIsShown(false)
    setDialogOpen(false)
  }

  const handleToggleTheme = () => {
    localStorage.setItem('lightMode', !lightMode)
    toggleTheme()
  }

  const logProfileClick = () => {
    if (!window.analytics) {
      const userId = account && account.name
      window.analytics.track('My Profile Click', { userId })
    }
  }

  const logNotifsClick = () => {
    if (!window.analytics) {
      const userId = account && account.name
      window.analytics.track('My Notifications Click', { userId })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('twitterMirrorInfo')
    localStorage.removeItem('YUP_ETH_AUTH')
    setAccount(null)
  }

  const listVariant = !['xl', 'lg', 'md'].includes(width)
    ? 'temporary'
    : 'permanent'
  const avatar = level && level.levelInfo.avatar

  const yupBalance =
    level &&
    level.levelInfo &&
    level.levelInfo.balance &&
    level.levelInfo.balance.YUP
  const weight = level && level.levelInfo && level.levelInfo.weight
  const formattedYupBalance =
    yupBalance && numeral(Number(yupBalance)).format('0,0.00')
  const formattedWeight = numeral(Math.floor(Number(weight))).format('0,0')

  const quantile = level && level.levelInfo.quantile
  const socialLevelColor = levelColors[quantile]

  const username = level && level.levelInfo.username

  const { palette } = useTheme()

  return (
    <ErrorBoundary>
      <AppBar
        className={classes.appBar}
        position='fixed'
        onMouseEnter={isMobile ? 'handleDrawerOpen' : null}
        onMouseLeave={isMobile ? 'handleDrawerClose' : null}
      >
        <Toolbar>
          <Grid
            alignItems='center'
            className={classes.container1}
            container
            direction='row'
            justifyContent='space-between'
          >
            <Grid item>
              <Grid alignItems='center'
                container
              >
                <Grid item>
                  <IconButton
                    size='small'
                    aria-label='open drawer'
                    className={classes.menuButton}
                    edge='start'
                    onClick={handleDrawerOpen}
                  >
                    {accountName ? (
                      <StyledProfileAvatar
                        username={username}
                        socialLevelColor={socialLevelColor}
                        avatar={avatar}
                      />
                    ) : (
                      <Grow in
                        timeout={400}
                      >
                        <Icon
                          alt='menu'
                          className='fal fa-bars'
                          style={{
                            maxWidth: '4vw',
                            width: '20px',
                            opacity: '0.6'
                          }}
                        />
                      </Grow>
                    )}
                  </IconButton>
                </Grid>
                <Grid className={classes.search}
                  item
                  tourname='Search'
                >
                  {!history.location.pathname.includes('leaderboard') ? (
                    <SearchBar />
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
            <Grid className={classes.searchMobile}
              item
            >
              {!history.location.pathname.includes('leaderboard') ? (
                <SearchBar />
              ) : (
                <YupListSearchBar />
              )}
            </Grid>
            <Grow in
              timeout={500}
            >
              <Grid className={classes.icons}
                item
              >
                {account && account.name ? (
                  <div onClick={logNotifsClick}
                    className={classes.notifWrap}
                  >
                    <NotifPopup
                      className={classes.topButtons}
                      notifications={notifications}
                    />
                  </div>
                ) : (
                  <Tooltip
                    placement='bottom'
                    disableTouchListener
                    title={
                      <Typography variant='tooltip'>
                        Create an account!
                      </Typography>
                    }
                  >
                    <Button
                      fullWidth
                      className={classes.signupBtn}
                      onClick={handleDialogOpen}
                      variant='contained'
                    >
                      Sign Up/Login
                    </Button>
                  </Tooltip>
                )}
              </Grid>
            </Grow>
          </Grid>
        </Toolbar>
        <AuthModal
          open={dialogOpen}
          onClose={handleDialogClose}
        />
        <CollectionDialog
          account={account}
          dialogOpen={collectionDialogOpen}
          postid={'routeFromUrl'}
          handleDialogClose={handleCollectionDialogClose}
        />
      </AppBar>
      <Drawer
        anchor='left'
        classes={{
          paper: isShown ? classes.drawerPaperOpen : classes.drawerPaperMini
        }}
        className={classes.drawer}
        onBackdropClick={handleDrawerClose}
        open={open}
        variant={listVariant}
        onMouseOver={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        style={{
          width: isShown ? '200px' : 'inherit',
          boxShadow: 'none'
        }}
      >
        <div className={classes.drawerHeader}>
          <List style={{ width: '100%' }}>
            {accountName ? (
              <ListItem
                className={classes.listItem}
                button
                component={Link}
                onClick={logProfileClick && handleDrawerClose}
                to={`/${username}`}
                style={{ paddingLeft: '11px' }}
              >
                <ListItemAvatar>
                  <Badge
                    color='secondary'
                    overlap='circular'
                    badgeContent={formattedWeight}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <StyledProfileAvatar
                      username={username}
                      socialLevelColor={socialLevelColor}
                      avatar={avatar}
                    />
                  </Badge>
                </ListItemAvatar>
                {isShown ? (
                  <Grow in
                    timeout={500}
                  >
                    <ListItemText
                      style={{ margin: 0 }}
                      primary={
                        <span
                          style={{
                            color: 'fourth',
                            fontSize: '15px',
                            fontWeight: 600
                          }}
                        >
                          {username}
                        </span>
                      }
                      secondary={
                        <span
                          style={{
                            color: palette.common.fourth,
                            fontWeight: 300,
                            fontSize: '10px'
                          }}
                        >
                          {formattedYupBalance} YUP
                        </span>
                      }
                    />
                  </Grow>
                ) : null}
              </ListItem>
            ) : (
              <ListItem
                className={classes.listItem}
                button
                component={Link}
                to='/'
                onClick={handleDrawerClose}
                style={{ paddingLeft: '0px', backgroundColor: 'transparent' }}
              >
                {isMobile ? (
                  <div />
                ) : (
                  <ListItemIcon>
                    <IconButton
                      size='small'
                      style={{ backgroundColor: `${palette.alt.third}70` }}
                    >
                      <img
                        style={{ width: '20px', aspectRatio: '1 / 1' }}
                        src={
                          lightMode
                            ? '/images/logos/logo.svg'
                            : '/images/logos/logo_w.svg'
                        }
                      />
                    </IconButton>
                  </ListItemIcon>
                )}
              </ListItem>
            )}
          </List>
        </div>
        <ListItem
          className={classes.listItem}
          button
          component={Link}
          to='/'
          onClick={handleDrawerClose}
          style={{ paddingLeft: '0px' }}
        >
          <ListItemIcon>
            <Icon fontSize='small'
              className='fal fa-home'
            />
          </ListItemIcon>
          {isShown ? (
            <Grow in
              timeout={600}
            >
              <ListItemText>
                <Typography variant='body2'>Home</Typography>
              </ListItemText>
            </Grow>
          ) : null}
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          component={Link}
          to='/leaderboard'
          onClick={handleDrawerClose}
          style={{ paddingLeft: '0px' }}
          tourname='LeaderboardButton'
        >
          <ListItemIcon style={{ textAlign: 'center' }}>
            <Icon
              fontSize='small'
              className='fal fa-trophy'
              style={{ overflow: 'visible', width: '100%' }}
            />
          </ListItemIcon>
          {isShown ? (
            <Grow in
              timeout={700}
            >
              <ListItemText>
                <Typography variant='body2'>Leaderboards</Typography>
              </ListItemText>
            </Grow>
          ) : null}
        </ListItem>
        <ListItem
          className={classes.listItem}
          button
          component={Link}
          onClick={handleDrawerClose}
          to='/leaderboard?site=all&subject=collections&category=overall'
          style={{ paddingLeft: '0px' }}
        >
          <ListItemIcon>
            <Icon fontSize='small'
              className='fal fa-list'
            />
          </ListItemIcon>
          {isShown ? (
            <Grow in
              timeout={800}
            >
              <ListItemText>
                <Typography variant='body2'>Collections</Typography>
              </ListItemText>
            </Grow>
          ) : null}
        </ListItem>

        {!isMobile && (
          <StyledYupProductNav
            isShown={isShown}
            isMobile={isMobile}
            account={account}
          />
        )}

        {account && account.name && (
          <ListItem
            className={classes.listItem}
            button
            component={Link}
            onClick={handleDrawerClose}
            to={`/${username}/analytics`}
            style={{ paddingLeft: '0px' }}
            tourname='LeaderboardButton'
          >
            <ListItemIcon style={{ textAlign: 'center' }}>
              <Icon
                fontSize='small'
                className='fal fa-chart-bar'
                style={{ overflow: 'visible', width: '100%' }}
              />
            </ListItemIcon>
            {isShown ? (
              <Grow in
                timeout={800}
              >
                <ListItemText>
                  <Typography variant='body2'>Analytics</Typography>
                </ListItemText>
              </Grow>
            ) : null}
          </ListItem>
        )}
        <ListItem dense
          style={{ bottom: 10, position: 'absolute' }}
        >
          <Grid container
            direction='row'
          >
            <Grid item
              xs={3}
            >
              <IconButton
                aria-label='delete'
                size='small'
                onClick={handleSettingsOpen}
              >
                <Icon
                  fontSize='small'
                  className='fal fa-gear'
                  style={{ color: palette.common.fourth }}
                />
              </IconButton>
            </Grid>
            {isShown ? (
              <Grow in
                timeout={500}
              >
                <Grid item
                  xs={3}
                >
                  <IconButton
                    aria-label='theme-mode'
                    size='small'
                    onClick={handleToggleTheme}
                  >
                    {lightMode ? (
                      <Icon
                        fontSize='small'
                        className='fal fa-moon'
                        style={{ color: palette.common.fourth }}
                      />
                    ) : (
                      <WbSunnyRoundedIcon
                        style={{ color: palette.common.fourth }}
                        fontSize='small'
                      />
                    )}
                  </IconButton>
                </Grid>
              </Grow>
            ) : null}
          </Grid>
        </ListItem>
        <StyledSettingsModal
          handleSettingsClose={handleSettingsClose}
          settingsOpen={settingsOpen}
          handleLogout={handleLogout}
        />
        {(isShown || isMobile) && (
          <StyledFirstMenuList
            Link={Link}
            handleDrawerClose={handleDrawerClose}
          />
        )}

        {/* Second Menu: LISTS */}
        {(isShown || isMobile) && <StyledSecondMenuList />}
      </Drawer>
    </ErrorBoundary>
  )
}

const mapActionToProps = (dispatch) => {
  return {
    toggleTheme: () => dispatch(toggleColorTheme())
  }
}

const mapStateToProps = (state) => {
  return {
    lightMode: state.lightMode.active
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
  isTourOpen: PropTypes.bool,
  lightMode: PropTypes.bool,
  toggleTheme: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withRouter(withStyles(styles)(withWidth()(SideBar))))
