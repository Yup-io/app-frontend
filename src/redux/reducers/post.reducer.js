import { postConstants as constants } from '../constants';
import produce from 'immer';

export function postWeight(state = {}, action) {
  return produce(state, (draft) => {
    let postWeightInfo;
    switch (action.type) {
      case constants.FETCH_POST_WEIGHT:
        draft[action.postid] = {
          isLoading: true,
          error: null,
          weights: null
        };
        break;
      case constants.FETCH_POST_WEIGHT_SUCCESS:
        draft[action.postid] = {
          isLoading: false,
          error: null,
          weights: {}
        };

        Object.keys(action.weights).map((k) => {
          draft[action.postid].weights[k] = Math.trunc(action.weights[k]);
        });
        break;
      case constants.FETCH_POST_WEIGHT_FAILURE:
        draft[action.postid] = {
          isLoading: false,
          error: action.error,
          weights: null
        };
        break;
      case constants.UPDATE_POST_WEIGHT:
        postWeightInfo = draft[action.postid];
        if (postWeightInfo) {
          if (postWeightInfo.weights) {
            const existingWeight = postWeightInfo.weights[action.category];
            if (existingWeight) {
              postWeightInfo.weights[action.category] += Math.trunc(
                action.amount
              );
            } else {
              postWeightInfo.weights[action.category] = Math.trunc(
                action.amount
              );
            }
          } else {
            postWeightInfo.weights = {
              [action.category]: Math.trunc(action.amount)
            };
          }
        } else {
          draft[action.postid] = {
            isLoading: null,
            error: null,
            weights: {
              [action.category]: Math.trunc(action.amount)
            }
          };
        }
        break;
      case constants.SET_POST_WEIGHT:
        postWeightInfo = draft[action.postid];
        if (postWeightInfo) {
          if (postWeightInfo.weights) {
            postWeightInfo.weights[action.category] = Math.trunc(action.amount);
          } else {
            postWeightInfo.weights = {
              [action.category]: Math.trunc(action.amount)
            };
          }
        } else {
          draft[action.postid] = {
            isLoading: null,
            error: null,
            weights: {
              [action.category]: Math.trunc(action.amount)
            }
          };
        }
        break;
      default:
        return state;
    }
  });
}

export function postInfo(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.FETCH_POST:
        draft[action.postid] = {
          isLoading: true,
          error: null,
          post: null
        };
        break;
      case constants.FETCH_POST_SUCCESS:
        draft[action.postid] = {
          isLoading: false,
          error: null,
          post: action.post
        };
        break;
      case constants.FETCH_POST_FAILURE:
        draft[action.postid] = {
          isLoading: false,
          error: action.error,
          post: null
        };
        break;
      case constants.UPDATE_POST_SEXTILES:
        let post = draft[action.postid];
        post.isLoading = false;
        post.error = null;
        post.quantiles = action.quantiles;
        break;
      case constants.UPDATE_POST_CAT_SEXTILE:
        post = draft[action.postid];
        post.isLoading = false;
        post.error = null;
        post.quantiles[action.category] = action.quantile;
        break;
      case constants.CLEAR_ALL_POST_INFO:
        for (var member in draft) delete draft[member];
        break;
      case constants.SET_POST_INFO:
        const postInfo = draft[action.postid];
        if (postInfo) {
          postInfo.post = {
            ...postInfo.post,
            ...action.post
          };
          postInfo.isLoading = false;
          postInfo.error = null;
        } else {
          draft[action.postid] = {
            post: action.post,
            isLoading: false,
            error: null
          };
        }
        break;
      default:
        return state;
    }
  });
}
