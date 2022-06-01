import { collectionsConstants as constants } from '../constants';
import produce from 'immer';

export function userCollections(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_USER_COLLECTIONS:
        draft[action.eosname] = {
          isLoading: true,
          collections: [],
          error: null
        };
        break;
      case constants.FETCH_USER_COLLECTIONS_SUCCESS:
        draft[action.eosname] = {
          isLoading: false,
          collections: action.collections,
          error: null
        };
        break;
      case constants.FETCH_USER_COLLECTIONS_FAILURE:
        draft[action.eosname] = {
          isLoading: false,
          collections: [],
          error: action.error
        };
        break;
      case constants.ADD_USER_COLLECTION:
        const prevCollections = draft[action.eosname].collections;
        prevCollections.push(action.collection);
        break;
      case constants.ADD_POST_TO_COLLECTION:
        const targetCollAdd = draft[action.eosname].collections.find(
          ({ _id }) => _id === action.collection._id
        );
        targetCollAdd.postIds.push(action.postid);
        break;
      case constants.REM_POST_FROM_COLLECTION:
        const targetCollRem = draft[action.eosname].collections.find(
          ({ _id }) => _id === action.collection._id
        );
        targetCollRem.postIds.splice(
          targetCollRem.postIds.indexOf(action.postid),
          1
        );
        break;
      default:
        return state;
    }
  });
}
