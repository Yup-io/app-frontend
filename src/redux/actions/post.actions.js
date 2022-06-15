import { postConstants as constants } from '../constants';
import axios from 'axios';
import { apiBaseUrl } from '../../config';

export function fetchPostWeight(postid) {
  return async (dispatch) => {
    dispatch(request(postid));
    try {
      const postWeights = (
        await axios.get(`${apiBaseUrl}/votes/weighted/post/${postid}`)
      ).data;
      dispatch(success(postid, postWeights.weights));
    } catch (err) {
      dispatch(failure(postid, err));
    }
  };

  function request(postid) {
    return { type: constants.FETCH_POST_WEIGHT, postid };
  }

  function success(postid, weights) {
    return { type: constants.FETCH_POST_WEIGHT_SUCCESS, postid, weights };
  }

  function failure(postid, error) {
    return { type: constants.FETCH_POST_WEIGHT_FAILURE, postid, error };
  }
}

export function updatePostWeight(postid, amount, category) {
  return { type: constants.UPDATE_POST_WEIGHT, postid, amount, category };
}

export function setPostWeight(postid, amount, category) {
  return { type: constants.SET_POST_WEIGHT, postid, amount, category };
}

export async function fetchPost(postid) {}

export function setPostInfo(postid, post) {
  return { type: constants.SET_POST_INFO, postid, post };
}

export function updatePostQuantiles(postid, quantiles) {
  return { type: constants.UPDATE_POST_SEXTILES, postid, quantiles };
}

export function updatePostCatQuantile(postid, quantile) {
  return { type: constants.UPDATE_POST_CAT_SEXTILE, postid, quantile };
}

export function clearAllPostInfo() {
  return { type: constants.CLEAR_ALL_POST_INFO };
}
