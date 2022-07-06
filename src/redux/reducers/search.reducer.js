import { searchConstants as constants } from '../constants';
import produce from 'immer';

const initialState = {
  userSearchResults: {
    isLoading: false,
    error: null,
    searchText: '',
    users: []
  },
  postSearchResults: {
    isLoading: false,
    searchText: '',
    error: null,
    posts: []
  },
  collectionSearchResults: {
    isLoading: false,
    searchText: '',
    error: null,
    collections: []
  }
};

export function searchResults(state = initialState, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_USER_SEARCH_RESULTS:
        // TODO: Don't reset users field
        return {
          isLoading: true,
          error: null,
          searchText: action.searchText,
          users: []
        };
      case constants.FETCH_USER_SEARCH_RESULTS_SUCCESS:
        draft.userSearchResults = {
          isLoading: false,
          error: null,
          searchText: action.searchText,
          users: action.users
        };
        return draft;
      case constants.FETCH_USER_SEARCH_RESULTS_FAILURE:
        draft.userSearchResults = {
          isLoading: false,
          searchText: action.searchText,
          error: action.error,
          users: []
        };
        return draft;
      case constants.FETCH_POST_SEARCH_RESULTS:
        // TODO: Don't reset posts field
        draft.postSearchResults = {
          isLoading: true,
          searchText: action.searchText,
          error: null,
          posts: []
        };
        return draft;
      case constants.FETCH_POST_SEARCH_RESULTS_SUCCESS:
        draft.postSearchResults = {
          isLoading: false,
          searchText: action.searchText,
          error: null,
          posts: action.posts
        };
        return draft;
      case constants.FETCH_POST_SEARCH_RESULTS_FAILURE:
        draft.postSearchResults = {
          isLoading: false,
          searchText: action.searchText,
          error: action.error,
          posts: []
        };
        return draft;
      case constants.FETCH_COLLECTION_SEARCH_RESULTS:
        draft.collectionSearchResults = {
          isLoading: true,
          searchText: action.searchText,
          error: null,
          collections: []
        };
        return draft;
      case constants.FETCH_COLLECTION_SEARCH_RESULTS_SUCCESS:
        draft.collectionSearchResults = {
          isLoading: false,
          searchText: action.searchText,
          error: null,
          collections: action.collections
        };
        return draft;
      case constants.FETCH_COLLECTION_SEARCH_RESULTS_FAILURE:
        draft.collectionSearchResults = {
          isLoading: false,
          searchText: action.searchText,
          error: action.error,
          collections: []
        };
        return draft;
    }
  });
}
