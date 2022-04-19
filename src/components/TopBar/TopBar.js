{/* TODO: Delete this if it's not used. */}
import React, { useState, useEffect, memo } from 'react'
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
  ListSubheader,
  ListItemSecondaryAction,
  Tooltip,
  Icon,
  ListItemIcon,
  DialogTitle,
  Typography,
  DialogContent,
  Dialog,
  Badge,
  Grow
} from '@material-ui/core'
import { withStyles, useTheme } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import wallet from '../../eos/scatter/scatter.wallet'
import ListLink from '@material-ui/core/Link'
import { Link } from 'react-router-dom'
import { useSelector, connect } from 'react-redux'
import UserAvatar from '../UserAvatar/UserAvatar'
import SearchBar from '../SearchBar/SearchBar'
import YupListSearchBar from '../YupLeaderboard/YupListSearchBar'
import Orange from '@material-ui/core/colors/orange'
import NotifPopup from '../Notification/NotifPopup'
import { levelColors } from '../../utils/colors'
import { withRouter } from 'react-router'
import SubscribeDialog from '../SubscribeDialog/SubscribeDialog'
import CollectionDialog from '../Collections/CollectionDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import numeral from 'numeral'
import { accountInfoSelector } from '../../redux/selectors'
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded'

const drawerWidth = 200
const { BACKEND_API, EXTENSION_LINK } = process.env

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 5,
    boxShadow: `0px 0px 0px ${theme.palette.common.first}`,
    borderBottom: `0px solid ${theme.palette.common.first}`,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    background: 'transparent'
  },
  topbuttons: {
    container1: {
      [theme.breakpoints.down('xs')]: {
        justify: 'center'
      }
    }
  },
  signupBtn: {
    backgroundColor: '#00E08E',
    fontFamily: 'Gilroy',
    width: '100%',
    height: '45px',
    borderRadius: '0.65rem',
    '&:hover': {
      backgroundColor: '#00E08E'
    },
    [theme.breakpoints.down('sm')]: {
      height: '40px',
      fontSize: '12px'
    },
    [theme.breakpoints.down('xs')]: {
      marginRight: '0'
    }
  },
  SearchMobile: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'contents'
    }
  },
  Search: {
    [theme.breakpoints.down('xs')]: {
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
    height: `calc(100vh - ${theme.spacing(2)}px)`,
    borderRight: '0px solid',
    backdropFilter: 'blur(15px)',
    overflowX: 'hidden',
    margin: `${theme.spacing(1)}px 0px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    backgroundColor: `${theme.palette.alt.second}88`,
    borderRadius: '0.65rem',
    maxWidth: '200px',
    zIndex: 2000,
    padding: `0px ${theme.spacing(1)}px`,
    transition: 'max-width 3s',
    'transition-timing-function': 'ease-in'
  },
  drawerPaperMini: {
    height: `calc(100vh - ${theme.spacing(2)}px)`,
    borderRight: '0px solid',
    backdropFilter: 'blur(0px)',
    overflowX: 'hidden',
    margin: `${theme.spacing(1)}px 0px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    backgroundColor: `${theme.palette.alt.second}00`,
    borderRadius: '0.65rem',
    maxWidth: '200px',
    zIndex: 2000,
    padding: `0px ${theme.spacing(1)}px`,
    transition: 'max-width 3s',
    'transition-timing-function': 'ease-in'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    color: Orange
  },
  list1: {
    background: 'transparent',
    border: '0px solid #e6e6e6'
  },
  listItemLink: {
    borderRadius: '0.65rem',
    '&:hover': {
      backgroundColor: `${theme.palette.alt.second}40`
    }
  },
  bottomBar: {
    background: 'transparent',
    textColor: 'white'
  },
  list2: {
    background: 'transparent',
    textColor: 'white',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  ListSubheader: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  ListItem: {
    borderRadius: '0.4rem'
  },
  menuButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  icons: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      marginRight: '0%'
    }
  },
  notifWrap: {
    width: '44px',
    [theme.breakpoints.down('xs')]: {
      width: 'auto'
    }
  },
  listButton: {
    opacity: 0.6,
    fontWeight: '300',
    margin: 0,
    '&:hover': {
      opacity: 1
    }
  },
  listInfoLinks: {
    color: '#888888'
  },
  navLogo: {
    maxWidth: '10vw',
    width: '15px'
  },
  avatarImage: {
    height: '35px',
    width: '35px',
    maxHeight: '35px',
    maxWidth: '35px',
    border: '2px solid',
    borderRadius: '100%',
    [theme.breakpoints.down('xs')]: {
      height: '30px',
      width: '30px'
    }
  },
  logoutBtn: {
    fontFamily: 'Gilroy',
    margin: 'auto',
    marginLeft: '15px',
    letterSpacing: '0.2em',
    width: '100px',
    height: '35px',
    fontSize: '10px',
    [theme.breakpoints.down('xs')]: {
      width: '75px',
      height: '30px',
      marginLeft: '5px',
      fontSize: '7px'
    },
    Toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0
      }
    },
    logo: {
      width: '40px',
      height: '40px',
      marginRight: '25px',
      [theme.breakpoints.down('xs')]: {
        width: '30px',
        height: '30px'
      }
    }
  }
})

function PrivateListItem ({ account, children }) {
  const isLoggedIn = account || (wallet.scatter && wallet.scatter.wallet === 'ScatterExtension')
  return isLoggedIn ? <> {children} </> : null
}

PrivateListItem.propTypes = {
  account: PropTypes.object,
  children: PropTypes.node.isRequired
}

const StyledAboutListLink = withStyles(styles)(function AboutListLink ({ classes }) {
  return (
    <ListItem className={classes.ListItem}
      button
      component={ListLink}
      href='https://yup.io'
      style={{ textDecoration: 'none', display: 'none' }}
    >
      <ListItemIcon style={{ minWidth: '20px' }}>
        <Icon className='fal fa-globe' />
      </ListItemIcon>
      <ListItemText>
        <Typography variant='body2'
          className={classes.typography}
        >
          About
        </Typography>
      </ListItemText>
    </ListItem>
  )
})
const StyledExtensionListLink = withStyles(styles)(function ExtensionListLink ({
  classes, isShown, isMobile
}) {
  return (
    <ListItem
      button
      component={ListLink}
      style={{ paddingLeft: '0px', textDecoration: 'none' }}
      href={EXTENSION_LINK}
      target='_blank'
    >

      <ListItemIcon>
        <Icon
          fontSize='small'
          className='fal fa-plug'
        />
      </ListItemIcon>
      {(isShown || isMobile) && (
        <Grow in
          timeout={600}
        >
          <ListItemText >
            <Typography variant='body2'
              className={classes.typography}
            >

              Extension
            </Typography>
          </ListItemText>
        </Grow>
      )}
    </ListItem>

  )
})

const StyledYupProductNav = withStyles(styles)(function YupProductNav ({ account, classes, isShown, isMobile }) {
  if (account) {
    return (
      <div />
    )
  }

  return (
    <List component='nav'
      aria-label='main'
      className={classes.list1}
    >
      <StyledExtensionListLink
        isShown={isShown}
        isMobile={isMobile}
      />
      <StyledAboutListLink />
    </List>
  )
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

const ProfileAvatar = memo(({ username, avatar, classes, socialLevelColor }) => (
  <ErrorBoundary>
    <UserAvatar
      alt={username}
      username={username}
      src={avatar}
      className={classes.avatarImage}
      style={{ border: `solid 2px ${socialLevelColor}`, aspectRatio: '1 / 1' }}
    />
  </ErrorBoundary>
))

ProfileAvatar.propTypes = {
  avatar: PropTypes.string,
  classes: PropTypes.object,
  username: PropTypes.string,
  socialLevelColor: PropTypes.string
}

const StyledProfileAvatar = withStyles(styles)(ProfileAvatar)

function TopBar ({ classes, history, width, isTourOpen, lightMode, toggleTheme }) {
  const isMobile = window.innerWidth <= 480
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [account, setAccount] = useState(null)
  const [isShown, setIsShown] = useState((isMobile || isTourOpen) || false)
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
      axios.get(`${BACKEND_API}/levels/user/${authInfo.account.name}`)
        .then(res => {
          const levelInfo = res.data
          setLevel({
            isLoading: false,
            error: false,
            levelInfo
          })
        })
        .catch(() => {})
    }
  }, [accountName])

  const fetchNotifs = () => {
    if (!accountName || notifications.length) { return }
    try {
      (axios.get(`${BACKEND_API}/notifications/${accountName}`)).then(({ data: notifs }) => {
        setNotifications(notifs.reverse())
      })
    } catch (err) {}
  }

  useEffect(() => {
    if (isTourOpen === undefined) { return }
    setIsShown(isTourOpen)
  }, [isTourOpen])

  function handleDrawerOpen () {
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

  function handleLogout () {
    localStorage.removeItem('twitterMirrorInfo')
    localStorage.removeItem('YUP_ETH_AUTH')
    setAccount(null)
  }

  const listVariant = !['xl', 'lg', 'md'].includes(width) ? 'temporary' : 'permanent'
  const avatar = level && level.levelInfo.avatar

  const yupBalance =
    level &&
    level.levelInfo &&
    level.levelInfo.balance &&
    level.levelInfo.balance.YUP
  const weight = level && level.levelInfo && level.levelInfo.weight
  const formattedYupBalance = yupBalance && numeral(Number(yupBalance)).format('0,0.00')
  const formattedWeight = numeral(Math.floor(Number(weight))).format('0,0')

  const quantile = level && level.levelInfo.quantile
  const socialLevelColor = levelColors[quantile]

  const username = (level && level.levelInfo.username)

  const { palette } = useTheme()

  return (
    <ErrorBoundary>
      <AppBar className={classes.appBar}
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
            justify='space-between'
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
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={handleDrawerOpen}
                  >
                    {accountName ? (
                      <StyledProfileAvatar username={username}
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
                <Grid className={classes.Search}
                  item
                  tourname='Search'
                >
                  {!history.location.pathname.includes('leaderboard') ? (
                    <SearchBar />
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
            <Grid className={classes.SearchMobile}
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
                      className={classes.topbuttons}
                      notifications={notifications}
                    />
                  </div>
                ) : (
                  <Tooltip
                    placement='bottom'
                    disableTouchListener
                    title={
                      <Typography
                        variant='tooltip'
                      >
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
        <SubscribeDialog
          account={account}
          dialogOpen={dialogOpen}
          handleDialogClose={handleDialogClose}
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
                className={classes.ListItem}
                button
                component={Link}
                onClick={logProfileClick && handleDrawerClose}
                to={`/${username}`}
                style={{ paddingLeft: '11px' }}
              >
                <ListItemAvatar>
                  <Badge
                    color='secondary'
                    overlap='circle'
                    badgeContent={formattedWeight}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                  >
                    <StyledProfileAvatar username={username}
                      socialLevelColor={socialLevelColor}
                      avatar={avatar}
                    />
                  </Badge>
                </ListItemAvatar>
                {isShown
                  ? <Grow in
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
                  </Grow> : null}
              </ListItem>
            ) : (
              <ListItem className={classes.ListItem}
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
                    <IconButton size='small'
                      style={{ backgroundColor: `${palette.alt.third}70` }}
                    > <img style={{ width: '20px', aspectRatio: '1 / 1' }}
                        src={lightMode
                          ? '/images/logos/logo.svg'
                          : '/images/logos/logo_w.svg'}
                      />
                    </IconButton>
                  </ListItemIcon>
                )}
              </ListItem>)}
          </List>
        </div>
        <ListItem className={classes.ListItem}
          button
          component={Link}
          to='/'
          onClick={handleDrawerClose}
          style={{ paddingLeft: '0px' }}
        >
          <ListItemIcon>
            <Icon
              fontSize='small'
              className='fal fa-home'
            />
          </ListItemIcon>
          {isShown
            ? <Grow in
              timeout={600}
            >
              <ListItemText >
                <Typography variant='body2'
                  className={classes.typography}
                >
                  {' '}
                  Home
                </Typography>
              </ListItemText>
            </Grow> : null }
        </ListItem>
        <ListItem className={classes.ListItem}
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
          {isShown
            ? <Grow in
              timeout={700}
            >
              <ListItemText >
                <Typography variant='body2'
                  className={classes.typography}
                >
                  Leaderboards
                </Typography>
              </ListItemText>
            </Grow> : null }
        </ListItem>
        <ListItem className={classes.ListItem}
          button
          component={Link}
          onClick={handleDrawerClose}
          to='/leaderboard?site=all&subject=collections&category=overall'
          style={{ paddingLeft: '0px' }}
        >
          <ListItemIcon>
            <Icon
              fontSize='small'
              className='fal fa-list'
            />
          </ListItemIcon>
          {isShown
            ? <Grow in
              timeout={800}
            >
              <ListItemText >
                <Typography variant='body2'
                  className={classes.typography}
                >
                  {' '}
                  Collections
                </Typography>
              </ListItemText>
            </Grow> : null }
        </ListItem>

        {!isMobile && <StyledYupProductNav isShown={isShown}
          isMobile={isMobile}
          account={account}
        />}

        {account && account.name && (
          <ListItem className={classes.ListItem}
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
            {isShown
              ? <Grow in
                timeout={800}
              >
                <ListItemText >
                  <Typography variant='body2'
                    className={classes.typography}
                  >
                    Analytics
                  </Typography>
                </ListItemText>
              </Grow> : null }
          </ListItem>)}
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
                className={classes.margin}
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
            {isShown
              ? <Grow in
                timeout={500}
              >

                <Grid item
                  xs={3}
                >
                  <IconButton
                    aria-label='theme-mode'
                    className={classes.margin}
                    size='small'
                    onClick={handleToggleTheme}
                  >
                    {
                      lightMode ? <Icon
                        fontSize='small'
                        className='fal fa-moon'
                        style={{ color: palette.common.fourth }}
                      />
                        : <WbSunnyRoundedIcon
                          style={{ color: palette.common.fourth }}
                          fontSize='small'
                        />
                    }

                  </IconButton>
                </Grid>
              </Grow>
              : null }
          </Grid>
        </ListItem>
        <Dialog
          aria-labelledby='form-dialog-title'
          onClose={handleSettingsClose}
          open={settingsOpen}
          className={classes.dialog}

        >
          <DialogTitle style={{ paddingLeft: '40px', paddingBottom: '10px' }}>
            <Typography variant='h4'>Settings</Typography>
          </DialogTitle>
          <DialogContent>
            <List className={classes.root}>
              <ListItem>
                <ListItemText
                  id='switch-list-label-wifi'
                  primary='Log out of Yup'
                />
                <ListItemSecondaryAction>
                  <Button
                    className={classes.logoutBtn}
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={handleLogout}
                    variant='outlined'
                  >
                    Log out
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
        {(isShown || isMobile) && (
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
                  <ListItem className={classes.ListItem}
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
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=crypto'
                >
                  <ListItemText
                    primary='Crypto'
                    className={classes.listButton}
                  />
                </ListItem>
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=nfts'
                >
                  <ListItemText
                    primary='NFTs'
                    className={classes.listButton}
                  />
                </ListItem>
                <ListItem className={classes.ListItem}
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
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=politics'
                >
                  <ListItemText
                    primary='Politics'
                    className={classes.listButton}
                  />
                </ListItem>
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=non-corona'
                >
                  <ListItemText
                    primary='Safe Space'
                    className={classes.listButton}
                  />
                </ListItem>
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=latenightcool'
                >
                  <ListItemText
                    primary='Popular'
                    className={classes.listButton}
                  />
                </ListItem>
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=lol'
                >
                  <ListItemText
                    primary='Funny'
                    className={classes.listButton}
                  />
                </ListItem>
                <ListItem className={classes.ListItem}
                  button
                  dense
                  component={Link}
                  onClick={handleDrawerClose}
                  to='/?feed=brainfood'
                >
                  <ListItemText
                    primary='Smart'
                    className={classes.listButton}
                  />
                </ListItem>
              </div>
            </List>
          </Grow>

        )}

        {/* Second Menu: LISTS */}
        {(isShown || isMobile) && (
          <Grow in
            timeout={1000}
          >
            <List
              component='nav'
              aria-label='secondary'
              className={classes.list1}
              tourname='InfoDrawer'
            >
              <ListItem className={classes.ListItem}
                button
                dense
                style={{ bottom: '0', marginTop: '6vh' }}
              >
                <ListItemText>
                  <p
                    className={classes.listInfoLinks}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      fontWeight: 300,
                      fontSize: '12px'
                    }}
                  >
                    <a
                      href='https://yup.io'
                      className={classes.listInfoLinks}
                      target='_blank'
                    >
                      Main Site
                    </a>
                    ,&nbsp;
                    <a
                      href='https://yup.live'
                      className={classes.listInfoLinks}
                      target='_blank'
                    >
                      Explorer
                    </a>
                    ,&nbsp;
                    <a
                      href='https://blog.yup.io'
                      className={classes.listInfoLinks}
                      target='_blank'
                    >
                      Blog
                    </a>
                    ,&nbsp;
                    <a
                      href='https://docs.yup.io'
                      className={classes.listInfoLinks}
                      target='_blank'
                    >
                      Docs
                    </a>
                    ,&nbsp;
                    <a
                      href='https://docs.google.com/document/d/1LFrn0eeTfiy8lWAs8TPzWeydkRI-TRCDP0_NHCBOR0s/edit?usp=sharing'
                      className={classes.listInfoLinks}
                      target='_blank'
                    >
                      Privacy
                    </a>
                  </p>
                </ListItemText>
              </ListItem>
            </List>
          </Grow>
        )}
      </Drawer>
    </ErrorBoundary>
  )
}

const mapActionToProps = (dispatch) => {
  return {
    toggleTheme: () => dispatch(toggleColorTheme())
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    lightMode: state.lightMode.active
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
  isTourOpen: PropTypes.bool,
  lightMode: PropTypes.bool,
  toggleTheme: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withRouter(withStyles(styles)(withWidth()(TopBar))))
