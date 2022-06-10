import { useDispatch, useSelector } from 'react-redux';
import Providers from '../../providers';
import Header from '../Header/Header';
import axios from 'axios';
import { apiBaseUrl } from '../../config';
import {
  fetchAuthInfo,
  fetchUserCollections,
  fetchUserPermissions,
  updateEthAuthInfo
} from '../../redux/actions';
import { useEffect } from 'react';
import { accountInfoSelector } from '../../redux/selectors';
import { ThemeModeProvider } from '../../contexts/ThemeModeContext'

const MainLayout = ({ children }) => {
  const accountName = useSelector((state) => accountInfoSelector(state)?.name);
  const dispatch = useDispatch();

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

  useEffect(() => {
    checkEthAuth();
    checkTwitterAuth();
  }, []);

  useEffect(() => {
    if (accountName) {
      dispatch(fetchAuthInfo(accountName));
      dispatch(fetchUserPermissions(accountName));
      dispatch(fetchUserCollections(accountName));
    }
  }, [accountName]);

  return (
    <ThemeModeProvider>
      <Providers>
        {/* TODO: Nextjs */}
        <Header isTourOpen={false} />
        {children}
      </Providers>
    </ThemeModeProvider>
  );
};

export default MainLayout;
