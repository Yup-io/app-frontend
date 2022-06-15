import { followConstants as constants } from '../constants';
import produce from 'immer';

export function followersByUser(state = {}, action) {
  return produce(state, (draft) => {
    let followerInfo;
    switch (action.type) {
      case constants.FETCH_FOLLOWERS:
        draft[action.username] = {
          isLoading: true,
          followers: [],
          error: null
        };
        break;
      case constants.FETCH_FOLLOWERS_SUCCESS:
        draft[action.username] = {
          isLoading: false,
          error: null,
          followers: action.followers
        };
        break;
      case constants.FETCH_FOLLOWERS_FAILURE:
        draft[action.username] = {
          isLoading: false,
          followers: [],
          error: action.error
        };
        break;
      case constants.UNFOLLOW_USER:
        followerInfo = draft[action.username];
        if (followerInfo) {
          followerInfo.followers.some((user) => {
            if (user._id === action.accountToUnfollow) {
              user.following = false;
              return true;
            }
            return false;
          });
        }

        followerInfo = draft[action.accountToUnfollow];
        if (followerInfo) {
          followerInfo.followers = followerInfo.followers.filter(
            (user) => user._id !== action.username
          );
        }
        break;
      case constants.FOLLOW_USER:
        followerInfo = draft[action.username];
        if (followerInfo) {
          followerInfo.followers.some((user) => {
            if (user._id === action.accountToFollow._id) {
              user.following = true;
              return true;
            }
            return false;
          });
        }

        followerInfo = draft[action.accountToFollow._id];
        if (followerInfo == null) {
          draft[action.accountToFollow._id] = {
            isLoading: false,
            error: null,
            followers: [{ ...action.followerInfo }]
          };
          break;
        }

        const isFollowing = followerInfo.followers.some(
          (user) => user._id === action.accountToFollow._id
        );

        if (!isFollowing) {
          followerInfo.followers.push(action.followerInfo);
        }
        break;
      default:
        return state;
    }
  });
}

export function followingByUser(state = {}, action) {
  return produce(state, (draft) => {
    let followerInfo;
    switch (action.type) {
      case constants.FETCH_FOLLOWING:
        draft[action.username] = {
          isLoading: true,
          following: [],
          error: null
        };
        break;
      case constants.FETCH_FOLLOWING_SUCCESS:
        draft[action.username] = {
          isLoading: false,
          following: action.following,
          error: null
        };
        break;
      case constants.FETCH_FOLLOWING_FAILURE:
        draft[action.username] = {
          isLoading: false,
          following: [],
          error: action.error
        };
        break;
      case constants.UNFOLLOW_USER:
        followerInfo = draft[action.username];
        if (followerInfo == null) break;
        followerInfo.following = followerInfo.following.filter(
          (user) => user._id !== action.accountToUnfollow
        );
        break;
      case constants.FOLLOW_USER:
        followerInfo = draft[action.username];
        if (followerInfo == null) break;

        const isFollowing = followerInfo.following.some(
          (user) => user._id === action.accountToFollow._id
        );

        if (!isFollowing) {
          followerInfo.following.push(action.accountToFollow);
        }
        break;
      default:
        return state;
    }
  });
}
