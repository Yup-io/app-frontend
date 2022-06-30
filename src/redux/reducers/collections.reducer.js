import { collectionsConstants as constants } from '../constants';
import produce from 'immer';

export function userCollections(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_USER_COLLECTIONS:
        return {
          isLoading: true,
          collections: [],
          error: null
        };
      case constants.FETCH_USER_COLLECTIONS_SUCCESS:
        draft[action.eosname] = {
          isLoading: false,
          collections: action.collections,
          error: null
        };
        return draft;
      case constants.FETCH_USER_COLLECTIONS_FAILURE:
        draft[action.eosname] = {
          isLoading: false,
          collections: [],
          error: action.error
        };
        return draft;
      case constants.ADD_USER_COLLECTION:
        const prevCollections = draft[action.eosname].collections;
        prevCollections.push(action.collection);
        return prevCollections;
      case constants.ADD_POST_TO_COLLECTION:
        const targetCollAdd = draft[action.eosname].collections.find(
          ({ _id }) => _id === action.collection._id
        );
        targetCollAdd.postIds.push(action.postid);
        return targetCollAdd;
      case constants.REM_POST_FROM_COLLECTION:
        const targetCollRem = draft[action.eosname].collections.find(
          ({ _id }) => _id === action.collection._id
        );
        targetCollRem.postIds.splice(
          targetCollRem.postIds.indexOf(action.postid),
          1
        );
        return targetCollRem;
      default:
        return state;
    }
  });
}
