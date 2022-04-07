import { feedConstants as constants } from '../constants'
import produce from 'immer'

const initialState = {
  homeFeed: 'dailyhits',
  feeds: {
    'nfts': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'crypto': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'dailyhits': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'new': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'politics': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'non-corona': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'latenightcool': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'lol': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'brainfood': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    },
    'mirror': {
      posts: [],
      isLoading: false,
      error: null,
      start: 0,
      limit: 10,
      hasMore: true
    }
  }
}

export function homeFeed (state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
    case constants.SET_HOME_FEED:
      draft.homeFeed = action.homeFeed
      break
    default:
      return state
    }
  })
}

export function feedInfo (state = initialState, action) {
  return produce(state, draft => {
    let feedInfo = draft.feeds[action.feedType]
    switch (action.type) {
    case constants.FETCH_FEED:
      feedInfo.isLoading = true
      feedInfo.error = null
      break
    case constants.FETCH_FEED_SUCCESS:
      feedInfo.isLoading = false
      feedInfo.posts = state.feeds[action.feedType].posts.concat(action.posts)
      feedInfo.start = action.newStart + action.newLimit
      feedInfo.limit = action.newLimit
      feedInfo.hasMore = !!action.posts.length
      feedInfo.error = null
      break
    case constants.FETCH_FEED_FAILURE:
      feedInfo = draft.feeds[action.feedType]
      feedInfo.isLoading = false
      feedInfo.error = action.error
      break
    default:
      return state
    }
  })
}
