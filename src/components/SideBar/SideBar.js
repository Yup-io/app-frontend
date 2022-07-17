import { Drawer, ExternalLinkList } from './styles';
import { Grow, List, ListItem, Typography } from '@mui/material';
import { faHome, faTrophy, faList, faCoins, faGear, faMoon, faBrightness, faMagnifyingGlass, faBell, faCircleXmark } from '@fortawesome/pro-light-svg-icons';
import MainLink from './MainLink';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import FeedLink from './FeedLink';
import ExternalLink from './ExternalLink';
import { landingPageUrl } from '../../config';
import { MENU_ANIMATION_DURATION, PRIVACY_URL } from '../../constants/const';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import SettingsModal from '../TopBarAndDrawer/SettingsModal';
import { LOCAL_STORAGE_KEYS } from '../../constants/enum';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions';
import useDevice from '../../hooks/useDevice';
import MobileMenuFab from './MobileMenuFab';
import SideBarContext from './SideBarContext';
import SearchUi from '../SearchUi';
import UserMenuItem from './UserMenuItem';
import YupLogoMenuItem from './YupLogoMenuItem';

const SideBar = () => {
  const dispatch = useDispatch();
  const { isDesktop } = useDevice();
  const { isLoggedIn } = useAuth();
  const { isLightMode, toggleTheme } = useThemeMode();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
        {isLoggedIn ? (
          <UserMenuItem />
        ) : (
          <YupLogoMenuItem />
        )}
        <List sx={{ flexGrow: open ? 0 : 1 }}>
          <MainLink icon={faHome} text="Home" to="/" />
          <MainLink icon={faTrophy} text="Leaderboards" to="/leaderboard" />
          <MainLink icon={faList} text="Collections" to="/leaderboard?site=all&subject=collections&category=overall" />
          <MainLink icon={faCoins} text="Staking" to="/staking" />
        </List>
        {open && (
          <>
            <Grow in timeout={MENU_ANIMATION_DURATION}>
              <List sx={{ flexGrow: 1 }}>
                <ListItem sx={{ pl: 1 }}>
                  <Typography variant={isDesktop ? 'bodyS1' : 'h6'} sx={{ color: (theme) => theme.palette.M300 }}>
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
            </Grow>
            {isDesktop && (
              <Grow in={open} timeout={MENU_ANIMATION_DURATION}>
                <ExternalLinkList>
                  <ExternalLink text="Main site" to={landingPageUrl} />
                  <ExternalLink text="Explorer" to="https://yup.live" />
                  <ExternalLink text="Blog" to="https://blog.yup.io" />
                  <ExternalLink text="Docs" to="https://docs.yup.io" />
                  <ExternalLink text="Privacy" to={PRIVACY_URL} />
                </ExternalLinkList>
              </Grow>
            )}
          </>
        )}
        <List>
          <MainLink
            icon={faMagnifyingGlass}
            text="Search"
            onClick={() => { setSearchOpen(!searchOpen); setOpen(false); }}
          />
          <MainLink icon={faBell} text="Notification" />
          <MainLink
            icon={isLightMode ? faMoon : faBrightness}
            text={isLightMode ? 'Dark mode' : 'Light mode'}
            onClick={() => toggleTheme()}
          />
          {isLoggedIn && (
            <MainLink icon={faGear} text="Settings" onClick={() => setSettingsOpen(true)} />
          )}
          {open && !isDesktop && (
            <MainLink icon={faCircleXmark} text="Close" onClick={() => setOpen(false)} />
          )}
        </List>
      </Drawer>

      {!isDesktop && (
        <MobileMenuFab onClick={() => setOpen(true)}/>
      )}

      {/* Search */}
      {searchOpen && (
        <SearchUi onClose={() => setSearchOpen(false)} />
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
