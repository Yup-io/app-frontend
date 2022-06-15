import { voteConstants as constants } from '../constants';
import axios from 'axios';
import { apiBaseUrl } from '../../config';

export function fetchInitialVotes(voter, postid) {
  return async (dispatch) => {
    dispatch(request(voter, postid));
    try {
      const votes = (
        await axios.get(`${apiBaseUrl}/votes/post/${postid}/voter/${voter}`)
      ).data;
      return dispatch(success(voter, postid, votes));
    } catch (err) {
      return dispatch(failure(voter, postid, err));
    }
  };

  function request(voter, postid) {
    return { type: constants.FETCH_INITIAL_VOTES, voter, postid };
  }

  function success(voter, postid, votes) {
    return {
      type: constants.FETCH_INITIAL_VOTES_SUCCESS,
      voter,
      postid,
      votes
    };
  }

  function failure(voter, postid, error) {
    return {
      type: constants.FETCH_INITIAL_VOTES_FAILURE,
      voter,
      postid,
      error
    };
  }
}

export function updateInitialVote(postid, voter, category, vote) {
  return { type: constants.UPDATE_INITIAL_VOTE, postid, voter, category, vote };
}

export function updateVoteLoading(postid, voter, category, isLoading) {
  return {
    type: constants.SET_VOTE_LOADING,
    postid,
    voter,
    category,
    isLoading
  };
}
