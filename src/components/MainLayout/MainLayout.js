import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { createTheme, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { darkPalette, lightPalette, theme } from '../../utils/theme';
import Providers from '../../providers';
import Header from '../Header/Header';
import axios from 'axios';
import { apiBaseUrl } from '../../config';
import {
  fetchAuthInfo,
  fetchUserCollections,
  fetchUserPermissions,
  toggleColorTheme,
  updateEthAuthInfo
} from '../../redux/actions';
import { useEffect } from 'react';
import { accountInfoSelector } from '../../redux/selectors';

const MainLayout = ({ children }) => {
  const accountName = useSelector((state) => accountInfoSelector(state)?.name);
  const lightMode = Boolean(useSelector((state) => state.lightMode.active));
  const dispatch = useDispatch();

  const activePalette = lightMode ? lightPalette : darkPalette;
  const themeWithPalette = createTheme({
    ...theme(activePalette),
    ...activePalette
  });

  const checkEthAuth = async () => {
    try {
      const ethAuthInfo = localStorage.getItem('YUP_ETH_AUTH');

      if (!ethAuthInfo) {
        return;
      }

      const { address, signature } = JSON.parse(ethAuthInfo);
      await axios.post(`${apiBaseUrl}/v1/eth/challenge/verify`, {
        address,
        signature
      }); // Will throw if challenge is invalid

      const account = (
        await axios.get(`${apiBaseUrl}/accounts/eth?address=${address}`)
      ).data;
      const ethAuthUpdate = { address, signature, account };

      dispatch(updateEthAuthInfo(ethAuthUpdate));
    } catch (err) {}
  };

  const checkTwitterAuth = async () => {
    try {
      const twitterMirrorInfo = localStorage.getItem('twitterMirrorInfo');
      if (!twitterMirrorInfo) {
        return;
      }
      const { expiration } = JSON.parse(twitterMirrorInfo);
      if (expiration <= Date.now()) {
        // if twitter oauth token expired, sign user out
        localStorage.removeItem('twitterMirrorInfo');
      }
    } catch (err) {}
  };

  const setThemePreference = async () => {
    try {
      const userPrefersLight =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches;
      const lightMode = JSON.parse(localStorage.getItem('lightMode'));
      if (lightMode || (userPrefersLight && lightMode === null)) {
        dispatch(toggleColorTheme());
      }
    } catch (err) {}
  };

  useEffect(() => {
    checkEthAuth();
    checkTwitterAuth();
    setThemePreference();
  }, []);

  useEffect(() => {
    if (accountName) {
      dispatch(fetchAuthInfo(accountName));
      dispatch(fetchUserPermissions(accountName));
      dispatch(fetchUserCollections(accountName));
    }
  }, [accountName]);

  return (
    <ThemeProvider theme={themeWithPalette}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Providers>
          {/* TODO: Nextjs */}
          <Header isTourOpen={false} />
          {children}
        </Providers>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
