import { GOATRaceVoteConstants as constants } from '../constants';

export function setInitialVote(vote) {
  return { type: constants.SET_INITIAL_VOTE, vote };
}
