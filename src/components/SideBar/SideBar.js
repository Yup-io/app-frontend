import { Drawer, DrawerLogo, ExternalLinkList } from './styles';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { faHome, faTrophy, faList, faChartLineUp, faCoins, faGear, faMoon, faBrightness, faMagnifyingGlass, faBell } from '@fortawesome/pro-light-svg-icons';
import MainLink from './MainLink';
import useAuth from '../../hooks/useAuth';
import { useState } from 'react';
import FeedLink from './FeedLink';
import ExternalLink from './ExternalLink';
import { landingPageUrl } from '../../config';
import { PRIVACY_URL } from '../../constants/const';
import { useThemeMode } from '../../contexts/ThemeModeContext';

const SideBar = () => {
  const { isLoggedIn } = useAuth();
  const { isLightMode } = useThemeMode();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <ListItemButton
          className="LogoLink"
          sx={{ p: 1, flexGrow: 0, borderRadius: 1 }}
        >
          <DrawerLogo src={`/images/logos/${isLightMode ? 'logo.svg' : 'logo_w.svg'}`} alt="logo" />
          <ListItemText
            primary="USERNAME"
            primaryTypographyProps={{ align: 'right' }}
            secondary="0.00 YUP"
            secondaryTypographyProps={{ variant: 'bodyS2', align: 'right' }}
          />
        </ListItemButton>
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
                <Typography variant="bodyS1" sx={{ color: (theme) => theme.palette.M300 }}>
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
            <ExternalLinkList>
              <ExternalLink text="Main site" to={landingPageUrl} />
              <ExternalLink text="Explorer" to="https://yup.live" />
              <ExternalLink text="Blog" to="https://blog.yup.io" />
              <ExternalLink text="Docs" to="https://docs.yup.io" />
              <ExternalLink text="Privacy" to={PRIVACY_URL} />
            </ExternalLinkList>
          </>
        )}
        <List>
          <MainLink icon={faMagnifyingGlass} text="Search" />
          <MainLink icon={faBell} text="Notification" />
          <MainLink icon={faMoon} text="Dark mode" />
          <MainLink icon={faGear} text="Settings" />
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;
