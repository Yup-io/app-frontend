import { listSearchConstants as constants } from '../constants/list-search.constants'
import produce from 'immer'

const initialState = {
  posts: [],
  initialLoad: true,
  isSearch: false,
  hasMore: true,
  listType: '',
  start: 0
}

export function updateSearchListPosts (state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.UPDATE_SEARCH:
      Object.assign(draft, action.searchInfo)
      break
    default:
      return state
    }
  })
}
