import { listSearchConstants as constants } from '../constants/list-search.constants';

export function updateSearchListPosts(searchInfo) {
  return { type: constants.UPDATE_SEARCH, searchInfo };
}
