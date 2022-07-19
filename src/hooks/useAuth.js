import { useSelector } from 'react-redux';
import { accountInfoSelector, authInfoSelector } from '../redux/selectors';

const modifyAuthInfo = (authInfo) => {
  if (authInfo.authType === 'eth') {
    return {
      address: authInfo.address,
      signature: authInfo.signature,
      authType: 'ETH'
    };
  } if (authInfo.authType === 'extension') {
    return {
      eosname: authInfo.eosname,
      signature: authInfo.signature,
      authType: 'extension'
    };
  } if (authInfo.authType === 'twitter') {
    return { oauthToken: authInfo.oauthToken, authType: 'twitter' };
  }
};

const useAuth = () => {
  const account = useSelector((state) => accountInfoSelector(state));
  const authInfo = useSelector((state) => authInfoSelector(state));

  return {
    isLoggedIn: Boolean(account?.name),
    authInfo: modifyAuthInfo(authInfo),
    ...account
  };
};

export default useAuth;
