import { commentsConstants as constants } from '../constants'
import produce from 'immer'

export function postComments (state = {}, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.FETCH_COMMENTS:
      draft[action.postid] = {
        isLoading: true,
        comments: [],
        error: null
      }
      break
    case constants.FETCH_COMMENTS_SUCCESS:
      draft[action.postid] = {
        isLoading: false,
        comments: action.comments,
        error: null
      }
      break
    case constants.FETCH_COMMENTS_FAILURE:
      draft[action.postid] = {
        isLoading: false,
        comments: [],
        error: action.error
      }
      break
    case constants.ADD_COMMENT:
      if (draft[action.postid]) {
        const prevComments = draft[action.postid].comments
        prevComments.push({
          author: action.author,
          comment: action.comment
        })
      }
      break
    default:
      return state
    }
  })
}
