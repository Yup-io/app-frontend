import { createSelector } from 'reselect';
import { windowExists } from '../../utils/helpers';

const scatterIdentitySelector = (state) =>
  state.scatterRequest && state.scatterRequest.account;
const ethSelector = (state) => state.ethAuth;
const userPermissionsSelector = (state) => state.userPermissions;

export const accountInfoSelector = createSelector(
  [scatterIdentitySelector, ethSelector, userPermissionsSelector],
  (scatter, eth, permissions) => {
    let account = scatter || eth;
    const twitterIdentity =
      windowExists() && localStorage?.getItem('twitterMirrorInfo');
    if (account && permissions && permissions[account.name]) {
      account.authority = permissions[account.name].userPerm;
    }
    if (!scatter) {
      if (eth && eth.account && eth.account._id) {
        account = {
          name: eth.account._id,
          authority: 'active',
          authInfo: {
            address: eth.address,
            signature: eth.signature,
            authType: 'ETH'
          }
        };
      } else if (twitterIdentity) {
        const { name, token } = JSON.parse(twitterIdentity);
        account = {
          name,
          authority: 'active',
          authInfo: { oauthToken: token }
        };
      }
    }
    return account;
  }
);
export const authInfoSelector = createSelector(
  (state) => state.authInfo,
  (authInfo) => {
    return authInfo;
  }
);

export const ethAuthSelector = createSelector([ethSelector], (ethAuth) => {
  let ethAuthInfo = ethAuth.account ? ethAuth : null;
  return ethAuthInfo;
});

export const userLevelSelector = createSelector(
  (state) => state.socialLevels.levels[state.authInfo.eosname],
  (level) => {
    let levelInfo = level ? level.levelInfo : null;
    return levelInfo;
  }
);

export const levelsSelector = createSelector(
  (state) => state.socialLevels.levels,
  (levels) => {
    return levels;
  }
);
