import { voteConstants as constants } from '../constants'
import produce from 'immer'

export function initialVotes (state = {}, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.FETCH_INITIAL_VOTES:
      if (action.voter in draft) {
        draft[action.voter][action.postid] = {
          isLoading: true,
          error: null,
          votes: {}
        }
      } else {
        draft[action.voter] = {
          [action.postid]: {
            isLoading: true,
            error: null,
            votes: {}
          }
        }
      }
      break
    case constants.FETCH_INITIAL_VOTES_SUCCESS:
      let votes = {}
      for (let vote of action.votes) {
        votes[vote.category] = vote
      }
      if (action.voter in draft) {
        draft[action.voter][action.postid] = {
          isLoading: false,
          error: null,
          votes
        }
      } else {
        draft[action.voter] = {
          [action.postid]: {
            isLoading: false,
            error: null,
            votes
          }
        }
      }
      break
    case constants.FETCH_INITIAL_VOTES_FAILURE:
      if (action.voter in draft) {
        draft[action.voter][action.postid] = {
          isLoading: false,
          error: action.error,
          votes: {}
        }
      } else {
        draft[action.voter] = {
          [action.postid]: {
            isLoading: false,
            error: action.error,
            votes: {}
          }
        }
      }
      break
    case constants.UPDATE_INITIAL_VOTE:
      const votesForPosts = draft[action.voter][action.postid]
      if (votesForPosts) {
        votesForPosts.isLoading = false
        votesForPosts.error = null
        votesForPosts.votes[action.category] = action.vote
      } else {
        draft[action.voter][action.postid] = {
          isLoading: false,
          error: null,
          votes: {
            [action.category]: action.vote
          }
        }
      }
      break
    case constants.SET_VOTE_LOADING:
      const existingVotes =
          draft[action.voter] && draft[action.voter][action.postid]
      if (existingVotes) {
        const existingVote = existingVotes.votes[action.category]
        existingVotes.votes[action.category] = {
          ...existingVote,
          isLoading: action.isLoading
        }
      } else {
        draft[action.voter] = {
          [action.postid]: {
            votes: {
              [action.category]: { isLoading: action.isLoading }
            }
          }
        }
      }

      break
    default:
      return state
    }
  })
}
