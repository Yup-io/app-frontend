import { AvatarSkeleton, Drawer, DrawerLogo, ExternalLinkList } from './styles';
import { Badge, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { faHome, faTrophy, faList, faChartLineUp, faCoins, faGear, faMoon, faBrightness, faMagnifyingGlass, faBell, faCircleXmark } from '@fortawesome/pro-light-svg-icons';
import MainLink from './MainLink';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import FeedLink from './FeedLink';
import ExternalLink from './ExternalLink';
import { landingPageUrl } from '../../config';
import { PRIVACY_URL } from '../../constants/const';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import { useSocialLevel } from '../../hooks/queries';
import { formatWeight } from '../../utils/helpers';
import { StyledProfileAvatar } from '../TopBarAndDrawer/StyledProfileAvatar';
import { levelColors } from '../../utils/colors';
import SettingsModal from '../TopBarAndDrawer/SettingsModal';
import { LOCAL_STORAGE_KEYS } from '../../constants/enum';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions';
import { useAuthModal } from '../../contexts/AuthModalContext';
import useDevice from '../../hooks/useDevice';
import MobileMenuFab from './MobileMenuFab';
import SideBarContext from './SideBarContext';

const SideBar = () => {
  const dispatch = useDispatch();
  const { isMobile } = useDevice();
  const { open: openAuthModal } = useAuthModal();
  const { isLoggedIn, name: username } = useAuth();
  const profile = useSocialLevel(username);
  const { isLightMode, toggleTheme } = useThemeMode();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ETH_AUTH);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TWITTER_INFO);

    dispatch(logout());
  };

  return (
    <SideBarContext.Provider
      value={{
        open
      }}
    >
      <Drawer
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {isLoggedIn && (
          <ListItemButton
            className="LogoLink"
            sx={{ p: 1, flexGrow: 0, borderRadius: 1 }}
            to={`/account/${username}`}
          >
            <ListItemAvatar sx={{ minWidth: 0 }}>
              {profile ? (
                <Badge
                  color="secondary"
                  overlap="circular"
                  badgeContent={profile && formatWeight(profile.weight)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                >
                  <StyledProfileAvatar
                    username={profile.username}
                    socialLevelColor={levelColors[profile.quantile]}
                    avatar={profile.avatar}
                  />
                </Badge>
              ) : (
                <AvatarSkeleton variant="circular" />
              )}
            </ListItemAvatar>
            {profile && (
              <ListItemText
                primary={profile.username}
                primaryTypographyProps={{ align: 'right', variant: isMobile ? 'h5' : 'body' }}
                secondary={profile && `${profile.weight} YUP`}
                secondaryTypographyProps={{ variant: isMobile ? 'h6' : 'bodyS2', align: 'right' }}
              />
            )}
          </ListItemButton>
        )}
        {!isLoggedIn && (
          <ListItemButton
            className="LogoLink"
            sx={{ p: 1, flexGrow: 0, borderRadius: 1 }}
            onClick={() => openAuthModal()}
          >
            <DrawerLogo src={`/images/logos/${isLightMode ? 'logo.svg' : 'logo_w.svg'}`} alt="logo" />
          </ListItemButton>
        )}
        <List sx={{ flexGrow: open ? 0 : 1 }}>
          <MainLink icon={faHome} text="Home" to="/" />
          <MainLink icon={faTrophy} text="Leaderboards" to="/leaderboard" />
          <MainLink icon={faList} text="Collections" to="/leaderboard?site=all&subject=collection&category=overall" />
          {isLoggedIn && (
            <MainLink icon={faChartLineUp} text="Analytics" to={`/analytics/${'a'}`} />
          )}
          <MainLink icon={faCoins} text="Staking" to="/staking" />
        </List>
        {open && (
          <>
            <List sx={{ flexGrow: 1 }}>
              <ListItem sx={{ pl: 1 }}>
                <Typography variant={isMobile ? 'h5' : 'bodyS1'} sx={{ color: (theme) => theme.palette.M300 }}>
                  Feeds
                </Typography>
              </ListItem>
              <FeedLink text="New" category="new" />
              <FeedLink text="Crypto" category="crypto" />
              <FeedLink text="NFTs" category="nfts" />
              <FeedLink text="Mirror Articles" category="mirror" />
              <FeedLink text="Politics" category="politics" />
              <FeedLink text="Safe Space" category="non-corona" />
            </List>
            {!isMobile && (
              <ExternalLinkList>
                <ExternalLink text="Main site" to={landingPageUrl} />
                <ExternalLink text="Explorer" to="https://yup.live" />
                <ExternalLink text="Blog" to="https://blog.yup.io" />
                <ExternalLink text="Docs" to="https://docs.yup.io" />
                <ExternalLink text="Privacy" to={PRIVACY_URL} />
              </ExternalLinkList>
            )}
          </>
        )}
        <List>
          <MainLink icon={faMagnifyingGlass} text="Search" />
          <MainLink icon={faBell} text="Notification" />
          <MainLink
            icon={isLightMode ? faMoon : faBrightness}
            text={isLightMode ? 'Dark mode' : 'Light mode'}
            onClick={() => toggleTheme()}
          />
          {isLoggedIn && (
            <MainLink icon={faGear} text="Settings" onClick={() => setSettingsOpen(true)} />
          )}
          {open && isMobile && (
            <MainLink icon={faCircleXmark} text="Close" onClick={() => setOpen(false)} />
          )}
        </List>
      </Drawer>

      {isMobile && (
        <MobileMenuFab onClick={() => setOpen(true)}/>
      )}

      {/* Modals */}

      <SettingsModal
        handleSettingsClose={() => setSettingsOpen(false)}
        settingsOpen={settingsOpen}
        handleLogout={handleLogout}
      />
    </SideBarContext.Provider>
  );
};

export default SideBar;
