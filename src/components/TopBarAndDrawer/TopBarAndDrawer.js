import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { toggleColorTheme } from '../../redux/actions'
import {
  ListItemAvatar,
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
  Grow,
  useMediaQuery
} from '@mui/material'
import IconMenu from '@mui/icons-material/Menu'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import { useSelector, connect } from 'react-redux'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import SearchBar from '../SearchBar/SearchBar'
import YupListSearchBar from '../YupLeaderboard/YupListSearchBar'
import NotifPopup from '../Notification/NotifPopup'
import { levelColors, Brand } from '../../utils/colors'
import CollectionDialog from '../Collections/CollectionDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import numeral from 'numeral'
import { accountInfoSelector } from '../../redux/selectors'
import { StyledYupProductNav } from './StyledYupProductNav'
import { StyledProfileAvatar } from './StyledProfileAvatar'
import { StyledFirstMenuList } from './StyledFirstMenuList'
import { StyledSecondMenuList } from './StyledSecondMenuList'
import { StyledSettingsModal } from './StyledSettingsModal'
import { YupButton } from '../Miscellaneous'
import { TopBar } from '../../_pages/pageLayouts'
import SideBarItem from './SideBarItem'
import { useAuthModal } from '../../contexts/AuthModalContext'
import { useConnect } from 'wagmi'
import useDevice from '../../hooks/useDevice'
import { apiBaseUrl } from '../../config'
import Link from '../Link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTrophy, faList, faChartLineUp, faCoins, faGear, faMoon, faBrightness } from '@fortawesome/pro-light-svg-icons';

const styles = theme => ({
  topButtons: {
    container1: {
      [theme.breakpoints.down('sm')]: {
        justify: 'center'
      }
    }
  },
  signupBtn: {
    height: 45,
    [theme.breakpoints.down('md')]: {
      height: 40,
      fontSize: 12
    },
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    //   padding: '4px 6px',
    //   fontSize: 14,
    //   fontWeight: 600,
    //   lineHeight: '100%'
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
    zIndex: 1200,
    flexShrink: 4,
    paperAnchorDockedLeft: {
      borderRight: '4px solid'
    },
    [theme.breakpoints.up('xs')]: {
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
    )}`,
    backgroundColor: `${theme.palette.M800}88`,
    borderRadius: '0.65rem',
    maxWidth: 200,
    zIndex: 1200,
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
    )}`,
    backgroundColor: `${theme.palette.M800}00`,
    borderRadius: '0.65rem',
    maxWidth: 200,
    zIndex: 1200,
    padding: `0 ${theme.spacing(1)}`,
    transition: 'max-width 3s',
    'transition-timing-function': 'ease-in',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    color: Brand.orange
  },
  listItem: {
    borderRadius: '0.4rem',
    paddingLeft: 0
  },
  menuButton: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  icons: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      marginRight: '0%'
    }
  },
  notifWrap: {
    width: 44,
    [theme.breakpoints.down('md')]: {
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
function useWidth () {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || 'xs'
  )
}
const defaultLevelInfo = {
  isLoading: true,
  error: false,
  levelInfo: {}
}

function TopBarAndDrawer ({ classes, isTourOpen, lightMode, toggleTheme }) {
  const width = useWidth()
  const { open: openAuthModal, startEthAuth } = useAuthModal()
  const [{ data: { connected } }] = useConnect()
  const { isMobile } = useDevice()
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [account, setAccount] = useState(null)
  const [isShown, setIsShown] = useState(isTourOpen || false)
  const [notifications, setNotifications] = useState([])
  const [level, setLevel] = useState(defaultLevelInfo)
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(null)
  let authInfo = useSelector(getReduxState)
  const router = useRouter()
  const accountName = authInfo && authInfo.account && authInfo.account.name

  useEffect(() => {
    const collectionDialog = router.query.collectionDialogOpen === 'true'
    setCollectionDialogOpen(collectionDialog || false)
    authInfo.account.name && setAccount(authInfo.account)
    fetchNotifs()
  }, [router, accountName])

  useEffect(() => {
    if (authInfo && authInfo.account && authInfo.account.name) {
      axios
        .get(`${apiBaseUrl}/levels/user/${authInfo.account.name}`)
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

  const fetchNotifs = () => {
    if (!accountName || notifications.length) {
      return
    }
    try {
      axios
        .get(`${apiBaseUrl}/notifications/${accountName}`)
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

  const handleDrawerClose = () => {
    setIsShown(false)
    setOpen(false)
  }
  const handleCollectionDialogClose = () => setCollectionDialogOpen(false)
  const handleSettingsOpen = () => setSettingsOpen(true)
  const handleSettingsClose = () => setSettingsOpen(false)
  const handleNavigate = (path) => {
    handleDialogClose()
    handleDrawerClose()
    router.push(path)
  }

  const handleDialogClose = () => {
    setIsShown(false)
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

  // Widths are inverted for whatever reason, should be 'sm' but seems like withWidth() has some bugs in it
  const listVariant = ['xs', 'sm'].includes(width)
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
      <TopBar>
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
                {!open && (
                  <Grid item>
                    <IconButton
                      size='small'
                      aria-label='open drawer'
                      className={classes.menuButton}
                      edge='start'
                      // eslint-disable-next-line
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
                          <IconMenu sx={{ opacity: 0.6 }} />
                        </Grow>
                      )}
                    </IconButton>
                  </Grid>)}

                <Grid className={classes.search}
                  item
                  tourname='Search'
                >
                  {!router.pathname.includes('leaderboard') ? (
                    <SearchBar />
                  ) : null}
                </Grid>
                <Grid className={classes.searchMobile}
                  item
                >
                  {!router.pathname.includes('leaderboard') ? (
                    <SearchBar />
                  ) : (
                    <YupListSearchBar />
                  )}
                </Grid>
              </Grid>
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
                ) : (!connected || !router.pathname.startsWith('/staking')) && (
                  <Tooltip
                    placement='bottom'
                    disableTouchListener
                    title={
                      <Typography variant='tooltip'>
                      Create an account!
                      </Typography>
                    }
                  >
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => (
                        <YupButton
                          fullWidth
                          className={classes.signupBtn}
                          onClick={() => {
                            // If it's staking page, just login with Eth.
                            if (router.pathname.startsWith('/staking')) {
                              openConnectModal()
                              startEthAuth({ noRedirect: true })
                            } else {
                              openAuthModal()
                            }
                          }}
                          variant='contained'
                          color='primary'
                          size='small'
                        >
                        Connect
                        </YupButton>
                      )}
                    </ConnectButton.Custom>
                  </Tooltip>
                )}
              </Grid>
            </Grow>
          </Grid>
        </Toolbar>
        <CollectionDialog
          account={account}
          dialogOpen={collectionDialogOpen}
          postid={'routeFromUrl'}
          handleDialogClose={handleCollectionDialogClose}
        />
      </TopBar>
      <Drawer
        anchor='left'
        classes={{
          paper: isShown ? classes.drawerPaperOpen : classes.drawerPaperMini
        }}
        className={classes.drawer}
        onClose={handleDrawerClose}
        open={open}
        variant={listVariant}
        onMouseOver={() => !isMobile && setIsShown(true)}
        onMouseLeave={() => !isMobile && setIsShown(false)}
        style={{
          width: isShown ? '200px' : 'inherit',
          boxShadow: 'none'
        }}
      >
        <div className={classes.drawerHeader}>
          <List style={{ width: '100%' }}>
            {accountName ? (
              <SideBarItem
                onClick={() => {
                  logProfileClick()
                  handleNavigate(`/account/${username}`)
                }}
                sx={{ pl: '12px !important' }}
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
                            color: palette.M400,
                            fontSize: '10px',
                            fontWeight: 300
                          }}
                        >
                          {formattedYupBalance} YUP
                        </span>
                      }
                    />
                  </Grow>
                ) : null}
              </SideBarItem>
            ) : (
              <SideBarItem onClick={openAuthModal}>
                {isMobile ? (
                  <div />
                ) : (
                  <ListItemIcon>
                    <IconButton
                      size='small'
                      style={{ backgroundColor: `${palette.M700}70` }}
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
              </SideBarItem>
            )}
          </List>
        </div>
        <SideBarItem onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faHome} />
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
        </SideBarItem>
        <SideBarItem onClick={() => handleNavigate('/leaderboard')}>
          <ListItemIcon style={{ textAlign: 'center' }}>
            <FontAwesomeIcon icon={faTrophy} />
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
        </SideBarItem>
        <SideBarItem onClick={() => handleNavigate('/leaderboard?site=all&subject=collections&category=overall')}>
          <ListItemIcon>
            <FontAwesomeIcon icon={faList} />
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
        </SideBarItem>

        {!isMobile && (
          <StyledYupProductNav
            isShown={isShown}
            isMobile={isMobile}
            account={account}
          />
        )}

        {account && account.name && (
          <SideBarItem onClick={() => handleNavigate(`/${username}/analytics`)}>
            <ListItemIcon style={{ textAlign: 'center' }}>
              <FontAwesomeIcon icon={faChartLineUp} />
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
          </SideBarItem>
        )}

        <SideBarItem onClick={() => handleNavigate(`/staking`)}>
          <ListItemIcon style={{ textAlign: 'center' }}>
            <FontAwesomeIcon icon={faCoins} />
          </ListItemIcon>
          {isShown ? (
            <Grow in
              timeout={800}
            >
              <ListItemText>
                <Typography variant='body2'>Staking</Typography>
              </ListItemText>
            </Grow>
          ) : null}
        </SideBarItem>
        <ListItem dense
          style={{ bottom: 10, position: 'absolute' }}
        >
          <Grid container
            alignItems='center'
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
                <FontAwesomeIcon icon={faGear} />
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
                      <FontAwesomeIcon icon={faMoon} />
                    ) : (
                      <FontAwesomeIcon icon={faBrightness} />
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
          // eslint-disable-next-line
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

TopBarAndDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  isTourOpen: PropTypes.bool,
  lightMode: PropTypes.bool,
  toggleTheme: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(TopBarAndDrawer))
