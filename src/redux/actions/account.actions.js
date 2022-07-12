import { accountConstants as constants } from '../constants';
import scatter from '../../eos/scatter/scatter.wallet';
import { editVote } from '../../apis';
import axios from 'axios';
import { apiGetAccount, editProfile } from '../../apis';
import { AUTH_TYPE } from '../../constants/enum';
import { apiBaseUrl } from '../../config';



export function deductBalance(username, amount, currency) {
  return { type: constants.DEDUCT_BALANCE, username, currency, amount };
}

export function updateWeight(username, update) {
  return { type: constants.UPDATE_WEIGHT, username, ...update };
}

export function logout() {
  return { type: constants.LOGOUT };
}

export function fetchAuthInfo(accountName) {
  return async (dispatch) => {
    dispatch(request());
    try {
      let authInfo;
      const ethAuthInfo = localStorage.getItem('YUP_ETH_AUTH');
      const twitterInfo = localStorage.getItem('twitterMirrorInfo');
      if (scatter.connected) {
        const { eosname, signature } = await scatter.scatter.getAuthToken();
        authInfo = {
          authType: AUTH_TYPE.EXTENSION,
          eosname,
          address: null,
          signature
        };
      } else if (twitterInfo) {
        const { token, name } = JSON.parse(twitterInfo);
        authInfo = {
          authType: AUTH_TYPE.TWITTER,
          eosname: name,
          address: null,
          oauthToken: token
        };
      } else if (ethAuthInfo) {
        try {
          const { address, signature } = JSON.parse(ethAuthInfo);
          await axios.post(`${apiBaseUrl}/v1/eth/challenge/verify`, {
            address,
            signature
          }); // Will throw if challenge is invalid
          const account = (
            await axios.get(`${apiBaseUrl}/accounts/eth?address=${address}`)
          ).data;
          authInfo = {
            authType: AUTH_TYPE.ETH,
            eosname: account.eosname,
            address: address,
            signature: signature
          };
        } catch (err) {
          localStorage.removeItem('YUP_ETH_AUTH');
          throw err;
        }
      }

      if (!authInfo) {
        throw new Error('No login detected');
      }

      if (accountName) {
        // If accountName exists, fetch some needed information from the back-end API
        try {
          const account = await apiGetAccount(accountName);

          authInfo.address =
            account && account.ethInfo && account.ethInfo.address;
        } catch (err) {}
      }

      dispatch(success(authInfo));
    } catch (err) {
      dispatch(failure(err));
    }
  };

  function request() {
    return { type: constants.FETCH_AUTH_TOKEN };
  }

  function success(authInfo) {
    return { type: constants.FETCH_AUTH_TOKEN_SUCCESS, ...authInfo };
  }

  function failure(error) {
    return { type: constants.FETCH_AUTH_TOKEN_FAILURE, error };
  }
}
export function updateAccountInfo(account, update, authInfo) {
  return async (dispatch) => {
    dispatch(request(account.name));
    try {

      await editProfile({
        username: account.name, ...update , authInfo
      });
      dispatch(success(account.name, update));
    } catch (err) {
      dispatch(failure(account.name, err));
    }
  };

  function request(username) {
    return { type: constants.UPDATE_ACCOUNT_INFO, username };
  }

  function success(username, update) {
    return { type: constants.UPDATE_ACCOUNT_INFO_SUCCESS, username, update };
  }

  function failure(username, error) {
    return { type: constants.UPDATE_ACCOUNT_INFO_FAILURE, username, error };
  }
}

export function updateEthAuthInfo(update) {
  return { type: constants.UPDATE_ETH_AUTH_INFO, ...update };
}

export function fetchAllSocialLevels() {
  return async (dispatch) => {
    dispatch(request());
    try {
      const levelsInfo = (await axios.get(`${apiBaseUrl}/levels`)).data;
      dispatch(success(levelsInfo));
    } catch (err) {
      dispatch(failure(err));
    }
  };

  function request() {
    return { type: constants.FETCH_ALL_SOCIAL_LEVELS };
  }

  function success(levelsInfo) {
    return { type: constants.FETCH_ALL_SOCIAL_LEVELS_SUCCESS, levelsInfo };
  }

  function failure(error) {
    return { type: constants.FETCH_ALL_SOCIAL_LEVELS_FAILURE, error };
  }
}

export function fetchSocialLevel(username) {
  return async (dispatch) => {
    dispatch(request(username));
    try {
      const levelInfo = (
        await axios.get(`${apiBaseUrl}/levels/user/${username}`)
      ).data;
      dispatch(success(username, levelInfo));
    } catch (err) {
      dispatch(failure(username, err));
    }
  };

  function request(username) {
    return { type: constants.FETCH_SOCIAL_LEVEL, username };
  }

  function success(username, levelInfo) {
    return { type: constants.FETCH_SOCIAL_LEVEL_SUCCESS, username, levelInfo };
  }

  function failure(username, error) {
    return { type: constants.FETCH_SOCIAL_LEVEL_FAILURE, username, error };
  }
}

export function fetchExtAuthToken() {
  return async (dispatch) => {
    dispatch(request());
    try {
      if (!scatter.identity) {
        throw new Error('Failed to fetch auth token. User not logged in');
      }
      const { eosname, signature } = await scatter.scatter.getAuthToken();
      dispatch(success(signature, eosname));
    } catch (err) {
      dispatch(failure(err));
    }
  };

  function request() {
    return { type: constants.FETCH_AUTH_TOKEN };
  }

  function success(signature, eosname) {
    return { type: constants.FETCH_AUTH_TOKEN_SUCCESS, signature, eosname };
  }

  function failure(error) {
    return { type: constants.FETCH_AUTH_TOKEN_FAILURE, error };
  }
}
