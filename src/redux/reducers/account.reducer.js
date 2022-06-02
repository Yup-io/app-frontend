import { accountConstants as constants } from '../constants';
import produce from 'immer';

export function currencyBalance(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_CURRENCY_BALANCE:
        draft[action.username] = { ...draft[action.username] };
        draft[action.username][action.currency] = {
          isLoading: true,
          balance: null,
          error: null
        };
        break;
      case constants.FETCH_CURRENCY_BALANCE_SUCCESS:
        draft[action.username][action.currency] = {
          isLoading: false,
          balance: action.balance,
          error: null
        };
        break;
      case constants.FETCH_CURRENCY_BALANCE_FAILURE:
        draft[action.username][action.currency] = {
          isLoading: false,
          balance: null,
          error: action.error
        };
        break;
      case constants.DEDUCT_BALANCE:
        const curr =
          draft[action.username] && draft[action.username][action.currency];
        draft[action.username] = {
          ...draft[action.username],
          [action.currency]: {
            isLoading: null,
            balance: curr && curr.balance ? curr.balance - action.amount : null,
            error: null
          }
        };
        break;
      default:
        return state;
    }
  });
}

export function resourceUsage(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_RESOURCE_USAGE:
        draft[action.username] = {
          isLoading: true,
          error: null,
          resourceInfo: null
        };
        break;
      case constants.FETCH_RESOURCE_USAGE_SUCCESS:
        draft[action.username] = {
          isLoading: false,
          error: null,
          resourceInfo: action.resourceInfo
        };
        break;
      case constants.FETCH_RESOURCE_USAGE_FAILURE:
        draft[action.username] = {
          isLoading: false,
          error: action.error,
          resourceInfo: null
        };
        break;
      default:
        return state;
    }
  });
}

export function socialLevels(state = { isLoading: true, levels: {} }, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_SOCIAL_LEVEL:
        draft.levels[action.username] = {
          isLoading: true,
          error: null,
          levelInfo: null
        };
        break;
      case constants.FETCH_SOCIAL_LEVEL_SUCCESS:
        draft.levels[action.username] = {
          isLoading: false,
          error: null,
          levelInfo: action.levelInfo
        };
        break;
      case constants.FETCH_SOCIAL_LEVEL_FAILURE:
        draft.levels[action.username] = {
          isLoading: false,
          error: action.error,
          levelInfo: null
        };
        break;
      case constants.FETCH_ALL_SOCIAL_LEVELS:
        draft.isLoading = true;
        draft.levels = {};
        break;
      case constants.FETCH_ALL_SOCIAL_LEVELS_SUCCESS:
        draft.isLoading = false;
        for (let level of action.levelsInfo) {
          draft.levels[level._id] = {
            isLoading: false,
            error: null,
            levelInfo: level
          };
        }
        break;
      case constants.FETCH_ALL_SOCIAL_LEVELS_FAILURE:
        draft.isLoading = false;
        draft.error = action.error;
        break;
      case constants.UPDATE_WEIGHT:
        const levelInfo = draft.levels[action.username].levelInfo;
        const upvotes = action.upvotes
          ? levelInfo.upvotes + action.upvotes
          : levelInfo.upvotes;
        const downvotes = action.downvotes
          ? levelInfo.downvotes + action.downvotes
          : levelInfo.downvotes;
        const balance = action.balance
          ? Number(levelInfo.balance.YUPX) + Number(action.balance)
          : levelInfo.balance.YUPX;
        levelInfo.weight = balance * Math.sqrt((upvotes + 1) / (downvotes + 1));
        levelInfo.upvotes = upvotes;
        levelInfo.downvotes = downvotes;
        break;
      case constants.UPDATE_ACCOUNT_INFO:
        draft.levels[action.username].isLoading = true;
        break;
      case constants.UPDATE_ACCOUNT_INFO_SUCCESS:
        draft.levels[action.username].levelInfo.isLoading = false;
        draft.levels[action.username].levelInfo.bio = action.update.bio;
        draft.levels[action.username].levelInfo.fullname =
          action.update.fullname;
        draft.levels[action.username].levelInfo.avatar = action.update.avatar;
        break;
      case constants.UPDATE_ACCOUNT_INFO_FAILURE:
        draft.levels[action.username].isLoading = false;
        draft.levels[action.username].error = action.error;
        break;
      default:
        return state;
    }
  });
}

export function ethAuth(
  state = { address: null, signature: null, account: null },
  action
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.UPDATE_ETH_AUTH_INFO:
        if (action.address) {
          draft.address = action.address;
        }
        if (action.signature) {
          draft.signature = action.signature;
        }
        if (action.account) {
          draft.account = action.account;
        }
        break;
      default:
        return state;
    }
  });
}

export function authInfo(
  state = { signature: null, eosname: null, isLoading: false, error: null },
  action
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_AUTH_TOKEN:
        draft.isLoading = true;
        draft.error = null;
        break;
      case constants.FETCH_AUTH_TOKEN_SUCCESS:
        draft.authType = action.authType;
        draft.signature = action.signature;
        draft.eosname = action.eosname;
        draft.address = action.address;
        draft.oauthToken = action.oauthToken;
        draft.isLoading = false;
        draft.error = null;
        break;
      case constants.FETCH_AUTH_TOKEN_FAILURE:
        draft.isLoading = false;
        draft.error = action.error;
        break;
      default:
        return state;
    }
  });
}
