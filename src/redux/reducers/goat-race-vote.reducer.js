import { GOATRaceVoteConstants as constants } from '../constants';
import produce from 'immer';

export function initialVote(state = {}, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case constants.SET_INITIAL_VOTE:
        draft['vote'] = action.vote;
        draft['isLoading'] = false;
        return draft;
      case constants.SET_VOTE_LOADING:
        draft['isLoading'] = action.isLoading;
        return draft;
      default:
        return state;
    }
  });
}
