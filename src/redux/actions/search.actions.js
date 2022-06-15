import { searchConstants as constants } from '../constants';
import axios from 'axios';
import { apiBaseUrl } from '../../config';

export function fetchUserSearchResults(searchText, limit) {
  return async (dispatch) => {
    dispatch(request(searchText, limit));
    try {
      const users = (
        await axios.get(`${apiBaseUrl}/search/es/users`, {
          params: { searchText, limit }
        })
      ).data;
      return dispatch(success(searchText, limit, users));
    } catch (err) {
      return dispatch(failure(searchText, limit, err));
    }
  };

  function request(searchText, limit) {
    return { type: constants.FETCH_USER_SEARCH_RESULTS, searchText, limit };
  }

  function success(searchText, limit, users) {
    return {
      type: constants.FETCH_USER_SEARCH_RESULTS_SUCCESS,
      searchText,
      limit,
      users
    };
  }

  function failure(searchText, limit, error) {
    return {
      type: constants.FETCH_USER_SEARCH_RESULTS_FAILURE,
      searchText,
      limit,
      error
    };
  }
}

export function fetchPostSearchResults(searchText, limit) {
  return async (dispatch) => {
    dispatch(request(searchText, limit));
    try {
      const posts = (
        await axios.get(`${apiBaseUrl}/search/es/posts`, {
          params: { searchText, limit }
        })
      ).data;
      return dispatch(success(searchText, limit, posts));
    } catch (err) {
      return dispatch(failure(searchText, limit, err));
    }
  };

  function request(searchText, limit) {
    return { type: constants.FETCH_POST_SEARCH_RESULTS, searchText, limit };
  }

  function success(searchText, limit, posts) {
    return {
      type: constants.FETCH_POST_SEARCH_RESULTS_SUCCESS,
      searchText,
      limit,
      posts
    };
  }

  function failure(searchText, limit, error) {
    return {
      type: constants.FETCH_POST_SEARCH_RESULTS_FAILURE,
      searchText,
      limit,
      error
    };
  }
}

export function fetchCollectionSearchResults(searchText, limit) {
  return async (dispatch) => {
    dispatch(request(searchText, limit));
    try {
      const collections = (
        await axios.get(`${apiBaseUrl}/search/es/collections`, {
          params: { searchText, limit }
        })
      ).data;
      return dispatch(success(searchText, limit, collections));
    } catch (err) {
      return dispatch(failure(searchText, limit, err));
    }
  };

  function request(searchText, limit) {
    return {
      type: constants.FETCH_COLLECTION_SEARCH_RESULTS,
      searchText,
      limit
    };
  }

  function success(searchText, limit, collections) {
    return {
      type: constants.FETCH_COLLECTION_SEARCH_RESULTS_SUCCESS,
      searchText,
      limit,
      collections
    };
  }

  function failure(searchText, limit, error) {
    return {
      type: constants.FETCH_COLLECTION_SEARCH_RESULTS_FAILURE,
      searchText,
      limit,
      error
    };
  }
}
