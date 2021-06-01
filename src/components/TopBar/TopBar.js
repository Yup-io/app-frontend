import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
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
  Badge
} from '@material-ui/core'
import {
  MuiThemeProvider,
  withStyles,
  createMuiTheme
} from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import wallet from '../../eos/scatter/scatter.wallet'
import ListLink from '@material-ui/core/Link'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserAvatar from '../UserAvatar/UserAvatar'
import SearchBar from '../SearchBar/SearchBar'
import YupListSearchBar from '../YupLeaderboard/YupListSearchBar'
import Orange from '@material-ui/core/colors/orange'
import NotifPopup from '../Notification/NotifPopup'
import { levelColors } from '../../utils/colors'
import { withRouter } from 'react-router'
import Grow from '@material-ui/core/Grow'
import SubscribeDialog from '../SubscribeDialog/SubscribeDialog'
import CollectionPostDialog from '../Collections/CollectionPostDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import numeral from 'numeral'

const drawerWidth = 190

const { BACKEND_API } = process.env

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 5,
    boxShadow: '0px 0px 0px white',
    borderBottom: '0px solid #1A1A1A',
    background: '#1A1A1A',
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      background: '#1A1A1A'
    }
  },
  topbuttons: {
    container1: {
      [theme.breakpoints.down('xs')]: {
        justify: 'center'
      }
    }
  },
  signupBtn: {
    backgroundColor: '#00eab7',
    fontFamily: 'Gilroy',
    width: '100%',
    height: '45px',
    '&:hover': {
      backgroundColor: '#00eab7'
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
    background: 'transparent',
    color: 'white',
    paperAnchorDockedLeft: {
      borderRight: '4px solid'
    },
    [theme.breakpoints.up('sm')]: {
      width: 190,
      flexShrink: 0
    }
  },
  drawerPaper: {
    borderRight: '0px solid',
    background: 'linear-gradient(90deg, #1b1b1b 80%, #232323 102%)',
    width: 190,
    boxShadow: '2px 0px 20px #0b0b0b40'
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
    border: '0px solid #e6e6e6',
    textColor: 'white'
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
    fontWeight: '100',
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
    color: '#ffffff',
    [theme.breakpoints.down('xs')]: {
      width: '75px',
      height: '30px',
      marginLeft: '5px',
      fontSize: '7px'
    },
    '.MuiListItemText-secondary': {
      Typography: {
        color: '#fafafa'
      }
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

const theme = createMuiTheme({
  palette: {
    primary: { main: '#000000' },
    secondary: { main: '#ffffff' },
    third: { main: '#00eab7' }
  },
  typography: {
    fontFamily: 'Gilroy',
    fontWeight: '100'
  },
  overrides: {
    MuiButton: {
      raisedSecondary: {
        color: 'white'
      }
    },
    MuiListItemIcon: {
      root: {
        color: '#c0c0c0',
        overflow: 'visible',
        textAlign: 'center',
        justifyContent: 'center'
      }
    },
    DialogContent: {
      root: {
        color: '#fafafa'
      }
    },
    MuiBadge: {
      colorSecondary: {
        backgroundColor: '#fafafa'
      }
    }
  },
  button: {
    width: 16,
    height: 16,
    padding: 5,
    color: '#ffffff'
  },
  icon: {
    width: 20,
    height: 20,
    color: 'primary'
  },
  Divider: {
    color: 'primary'
  },
  ListItemText: {
    fontFamily: 'Gilroy, sans-serif',
    color: 'primary',
    fontSize: 100
  },
  drawerPaper: {
    backgroundColor: 'primary'
  },
  backDrop: {
    backdropFilter: 'blur(3px)',
    backgroundColor: 'rgba(0,0,30,0.4)'
  }
})

function PrivateListItem ({ account, children }) {
  const isLoggedIn =
    account || (wallet.scatter && wallet.scatter.wallet === 'ScatterExtension')
  return isLoggedIn ? <Fragment> {children} </Fragment> : null
}

PrivateListItem.propTypes = {
  account: PropTypes.object,
  children: PropTypes.node.isRequired
}

const StyledAboutListLink = withStyles(styles)(function AboutListLink ({
  classes
}) {
  return (
    <ListLink
      href='https://yup.io'
      style={{ textDecoration: 'none', display: 'none' }}
    >
      <ListItem button>
        <ListItemIcon style={{ minWidth: '20px' }}>
          <Icon className='fal fa-globe' />
        </ListItemIcon>
        <ListItemText>
          <span
            className={classes.typography}
            style={{ color: '#c0c0c0', fontWeight: '100' }}
          >
            About
          </span>
        </ListItemText>
      </ListItem>
    </ListLink>
  )
})
const StyledExtensionListLink = withStyles(styles)(function ExtensionListLink ({
  classes
}) {
  return (
    <ListLink
      href='https://chrome.google.com/webstore/detail/yup-opinions-social-capit/nhmeoaahigiljjdkoagafdccikgojjoi'
      style={{ textDecoration: 'none' }}
      target='_blank'
    >
      <ListItem button
        style={{ padding: '0px 16px 0px 5px' }}
      >
        <ListItemIcon>
          <Icon className='fal fa-plug' />
        </ListItemIcon>
        <ListItemText>
          <span
            className={classes.typography}
            style={{ color: '#c0c0c0', fontWeight: '100' }}
          >
            {' '}
            Extension
          </span>
        </ListItemText>
      </ListItem>
    </ListLink>
  )
})

const StyledYupProductNav = withStyles(styles)(function YupProductNav ({
  account,
  classes
}) {
  if (account) {
    return (
      <List component='nav'
        aria-label='main'
        className={classes.list1}
      >
        {/* <StyledYupListLink /> */}
        <StyledAboutListLink />
      </List>
    )
  }

  return (
    <List component='nav'
      aria-label='main'
      className={classes.list1}
    >
      <StyledExtensionListLink />
      {/* <StyledYupListLink /> */}
      <StyledAboutListLink />
    </List>
  )
})

const getReduxState = state => {
  // Retrieve item twitterMirrorInfo from localStorage
  const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
  const twitterInfo =
    cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)

  const ethAccount = state.ethAuth.account

  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || twitterInfo || ethAccount
  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  return {
    account
  }
}

const defaultLevelInfo = {
  isLoading: true,
  error: false,
  levelInfo: {}
}

function TopBar ({ classes, notifications, history, width, isTourOpen }) {
  const [open, setOpen] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [account, setAccount] = React.useState(null)
  const [isShown, setIsShown] = useState(isTourOpen || false)

  const [collectionDialogOpen, setCollectionDialogOpen] = React.useState(false)

  let authInfo = useSelector(getReduxState)

  const [level, setLevel] = React.useState(defaultLevelInfo)

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const dialog = params.get('signupOpen')
    const collectionDialog = params.get('collectionDialogOpen')
    setDialogOpen((!account && dialog) || false)
    setCollectionDialogOpen(collectionDialog || false)
    setAccount(authInfo.account)
  }, [authInfo])

  useEffect(() => {
    if (authInfo && authInfo.account) {
      axios.get(`${BACKEND_API}/levels/user/${authInfo.account.name}`).then(res => {
        const levelInfo = res.data
        setLevel({
          isLoading: false,
          error: false,
          levelInfo
        })
      })
      .catch(() => {})
    }
  }, authInfo.account)

  useEffect(() => {
    setIsShown(isTourOpen)
  }, [isTourOpen])

  function handleDrawerOpen () {
    setOpen(true)
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleCollectionDialogClose = () => setCollectionDialogOpen(false)

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const logProfileClick = () => {
    const userId = account && account.name
    window.analytics.track('My Profile Click', { userId })
  }

  const logNotifsClick = () => {
    const userId = account && account.name
    window.analytics.track('My Notifications Click', { userId })
  }

  function handleDrawerClose () {
    setOpen(false)
  }

  const handleSettingsOpen = () => {
    setSettingsOpen(true)
  }

  const handleSettingsClose = () => {
    setSettingsOpen(false)
  }

  function handleLogout () {
    localStorage.removeItem('twitterMirrorInfo')
    localStorage.removeItem('YUP_ETH_AUTH')
    setAccount(null)
  }

  const listVariant = !['xl', 'lg', 'md'].includes(width)
    ? 'temporary'
    : 'permanent'
  const avatar = level && level.levelInfo.avatar
  const eosname = account && account.name
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

  const username = (level && level.levelInfo.username) || eosname
  const isMobile = window.innerWidth <= 480

  const ProfileAvatar = props => (
    <UserAvatar
      alt={username}
      username={username}
      src={avatar}
      className={classes.avatarImage}
      style={{ border: `solid 2px ${socialLevelColor}`, aspectRatio: '1 / 1' }}
    />
  )

  return (
    <ErrorBoundary>
      <div>
        <AppBar className={classes.appBar}
          position='fixed'
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
                      onClick={handleDrawerOpen}
                      style={{ color: '#9a9a9a' }}
                    >
                      {account && account.name ? (
                        <ProfileAvatar />
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
                        <p
                          color='#fff'
                          style={{ fontSize: '12px', fontWeight: '300' }}
                        >
                          Create an account!
                        </p>
                      }
                    >
                      {isMobile ? (
                        <Button
                          fullWidth
                          className={classes.signupBtn}
                          onClick={handleDialogOpen}
                          variant='outlined'
                        >
                          Sign Up/Login
                        </Button>
                      ) : (
                        <div />
                      )}
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
          <CollectionPostDialog
            account={account}
            dialogOpen={collectionDialogOpen}
            postid={'routeFromUrl'}
            handleDialogClose={handleCollectionDialogClose}
          />
        </AppBar>
        <MuiThemeProvider theme={theme}>
          <Drawer
            anchor='left'
            classes={{
              paper: classes.drawerPaper
            }}
            className={classes.drawer}
            onClick={handleDrawerClose}
            open={open}
            variant={listVariant}
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
          >
            <MuiThemeProvider theme={theme}>
              <div className={classes.drawerHeader}>
                <List style={{ width: '100%' }}>
                  {account && account.name ? (
                    <ListItem
                      button
                      component={Link}
                      onClick={logProfileClick}
                      to={`/${username}`}
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
                          style={{
                            overrides: {
                              MuiBadge: {
                                colorSecondary: {
                                  backgroundColor: 'primary'
                                }
                              }
                            }
                          }}
                        >
                          <ProfileAvatar />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <span
                            style={{
                              color: '#fafafa',
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
                              color: '#c0c0c0',
                              fontWeight: 300,
                              fontSize: '10px'
                            }}
                          >
                            {formattedYupBalance} YUP
                          </span>
                        }
                      />
                    </ListItem>
                  ) : (
                    <ListItem button>
                      <Tooltip
                        placement='bottom'
                        disableTouchListener
                        title={
                          <p
                            color='#fff'
                            style={{ fontSize: '12px', fontWeight: '300' }}
                          >
                            Create an account!
                          </p>
                        }
                      >
                        {isMobile ? (
                          <div />
                        ) : (
                          <Button
                            fullWidth
                            className={classes.signupBtn}
                            onClick={handleDialogOpen}
                            variant='outlined'
                          >
                            Sign Up/Login
                          </Button>
                        )}
                      </Tooltip>
                    </ListItem>
                  )}
                </List>
              </div>
              <ListItem
                button
                component={Link}
                to='/'
                style={{ paddingLeft: '5px' }}
              >
                <ListItemIcon>
                  <Icon fontSizeSmall
                    className='fal fa-home'
                  />
                </ListItemIcon>
                <ListItemText>
                  <span
                    className={classes.typography}
                    style={{ color: '#c0c0c0', fontWeight: '100' }}
                  >
                    {' '}
                    Home
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem
                button
                component={Link}
                to='/leaderboard'
                style={{ paddingLeft: '5px' }}
                tourname='LeaderboardButton'
              >
                <ListItemIcon style={{ textAlign: 'center' }}>
                  <Icon
                    fontSizeSmall
                    className='fal fa-trophy'
                    style={{ overflow: 'visible', width: '100%' }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <span
                    className={classes.typography}
                    style={{ color: '#c0c0c0', fontWeight: '100' }}
                  >
                    Leaderboards
                  </span>
                </ListItemText>
              </ListItem>
              <ListItem
                button
                component={Link}
                to='/leaderboard?site=all&subject=collections&category=overall'
                style={{ paddingLeft: '5px' }}
              >
                <ListItemIcon>
                  <Icon fontSizeSmall
                    className='fal fa-list'
                  />
                </ListItemIcon>
                <ListItemText>
                  <span
                    className={classes.typography}
                    style={{ color: '#c0c0c0', fontWeight: '100' }}
                  >
                    {' '}
                    Collections
                  </span>
                </ListItemText>
              </ListItem>
              {account && account.name && (
                <ListItem
                  button
                  component={Link}
                  to={`/${account.name}/analytics`}
                  style={{ paddingLeft: '5px' }}
                  tourname='LeaderboardButton'
                >
                  <ListItemIcon style={{ textAlign: 'center' }}>
                    <Icon
                      fontSizeSmall
                      className='fal fa-chart-bar'
                      style={{ overflow: 'visible', width: '100%' }}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <span
                      className={classes.typography}
                      style={{ color: '#c0c0c0', fontWeight: '100' }}
                    >
                      Analytics
                    </span>
                  </ListItemText>
                </ListItem>
              )}
              <ListItem dense
                style={{ bottom: 10, position: 'absolute' }}
              >
                <Grid container>
                  <Grid item>
                    <IconButton
                      aria-label='delete'
                      className={classes.margin}
                      size='small'
                      onClick={handleSettingsOpen}
                    >
                      <Icon
                        fontSize='small'
                        className='fal fa-gear'
                        style={{ color: '#c0c0c0' }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
              <Dialog
                aria-labelledby='form-dialog-title'
                onClose={handleSettingsClose}
                open={settingsOpen}
                className={classes.dialog}
                PaperProps={{
                  style: {
                    backgroundColor: '#0A0A0A',
                    borderRadius: '25px',
                    boxShadow: '0px 0px 20px 6px rgba(255, 255, 255, 0.1)',
                    width: '80%',
                    padding: '1rem 0.5rem',
                    maxWidth: '500px',
                    color: '#fafafa'
                  }
                }}
                BackdropProps={{
                  style: {
                    backdropFilter: 'blur(3px)'
                  }
                }}
              >
                <DialogTitle style={{ paddingBottom: '10px' }}>
                  <Typography
                    variant='h3'
                  >
                    Settings
                  </Typography>
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
                          onClick={handleLogout}
                          color='secondary'
                          variant='outlined'
                        >
                          Log out
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </DialogContent>
              </Dialog>

              <StyledYupProductNav account={account} />

              {/* First Menu: FEEDS */}
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
                        color: '#c0c0c0',
                        fontSize: '12px',
                        fontWeight: '500',
                        letterSpacing: '0.02em'
                      }}
                    >
                      FEEDS
                    </ListSubheader>
                    <PrivateListItem>
                      <ListItem
                        button
                        dense
                        component={Link}
                        to='/?feed=dailyhits'
                      >
                        <ListItemText
                          primary='Your Daily Hits'
                          className={classes.listButton}
                          style={{ color: '#c0c0c0', fontWeight: '100', margin: 0 }}
                        />
                      </ListItem>
                    </PrivateListItem>
                    <ListItem
                      button
                      dense
                      component={Link}
                      to='/?feed=crypto'
                    >
                      <ListItemText
                        primary='Crypto'
                        style={{ color: '#c0c0c0', margin: 0 }}
                        className={classes.listButton}
                      />
                    </ListItem>
                    <ListItem button
                      dense
                      component={Link}
                      to='/?feed=nfts'
                    >
                      <ListItemText
                        primary='NFTs'
                        style={{ color: '#c0c0c0', margin: 0 }}
                        className={classes.listButton}
                      />
                    </ListItem>
                    <ListItem
                      button
                      dense
                      component={Link}
                      to='/?feed=politics'
                    >
                      <ListItemText
                        primary='Politics'
                        style={{ color: '#c0c0c0', margin: 0 }}
                        className={classes.listButton}
                      />
                    </ListItem>
                    <ListItem
                      button
                      dense
                      component={Link}
                      to='/?feed=non-corona'
                    >
                      <ListItemText
                        primary='Safe Space'
                        className={classes.listButton}
                        style={{ color: '#c0c0c0', margin: 0 }}
                      />
                    </ListItem>
                    <ListItem
                      button
                      dense
                      component={Link}
                      to='/?feed=latenightcool'
                    >
                      <ListItemText
                        primary='Popular'
                        className={classes.listButton}
                        style={{ color: '#c0c0c0', margin: 0 }}
                      />
                    </ListItem>
                    <ListItem button
                      dense
                      component={Link}
                      to='/?feed=lol'
                    >
                      <ListItemText
                        primary='Funny'
                        style={{ color: '#c0c0c0', margin: 0 }}
                        className={classes.listButton}
                      />
                    </ListItem>
                    <ListItem
                      button
                      dense
                      component={Link}
                      to='/?feed=brainfood'
                    >
                      <ListItemText
                        primary='Smart'
                        style={{ color: '#c0c0c0', margin: 0 }}
                        className={classes.listButton}
                      />
                    </ListItem>
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
                    <ListItem
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
            </MuiThemeProvider>
          </Drawer>
        </MuiThemeProvider>
      </div>
    </ErrorBoundary>
  )
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  history: PropTypes.object,
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']).isRequired,
  isTourOpen: PropTypes.bool
}

export default withRouter(withStyles(styles)(withWidth()(TopBar)))
