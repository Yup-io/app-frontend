import { useInfiniteQuery, useQuery } from 'react-query';
import sum from 'lodash/sum';
import { REACT_QUERY_KEYS } from '../constants/enum';
import callYupApi from '../apis/base_api';
import { DEFAULT_FEED_PAGE_SIZE, DEFAULT_SEARCH_SIZE } from '../config';

export const useCollection = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.YUP_COLLECTION, id], () =>
    callYupApi({
      url: `/collections/name/${id}`,
      method: 'GET'
    })
  );
  return data;
};

export const useRecommendation = (params) => {
  const { name, description, id, limit } = params;
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_COLLECTION, id, name, description, limit],
    () =>
      callYupApi({
        url: '/collections/recommended',
        method: 'GET',
        params
      })
  );
  return data;
};

export const useInitialVotes = (postid, voter) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_INITIAL_VOTES, postid, voter],
    () =>
      callYupApi({
        url: `/votes/post/${postid}/voter/${voter}`,
        method: 'GET'
      })
  );
  return data;
};

export const useSocialLevel = (voter) => {
  const { data } = useQuery([REACT_QUERY_KEYS.YUP_SOCIAL_LEVEL, voter], () => {
    if (!voter) return null;
    return callYupApi({
      url: `/levels/user/${voter}`,
      method: 'GET'
    });
  });

  return data;
};

export const useFollowings = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.FOLLOWING, id], () =>
    callYupApi({
      method: 'GET',
      url: `/following/${id}`
    })
  );

  return data;
};

export const useFollowers = (id) => {
  const { data } = useQuery([REACT_QUERY_KEYS.FOLLOWER, id], () =>
    callYupApi({
      method: 'GET',
      url: `/v2/followers/${id}`
    })
  );

  return data;
}

export const useUserPosts = (userId) => {
  return useInfiniteQuery(
    [REACT_QUERY_KEYS.USER_POSTS, userId],
    ({ pageParam = 0 }) => {
      return callYupApi({
        method: 'GET',
        url: `/feed/account/${userId}`,
        params: {
          start: pageParam,
          limit: DEFAULT_FEED_PAGE_SIZE
        }
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.posts?.length) return undefined;

        return sum(allPages.map((page) => page.posts?.length || 0));
      }
    }
  );
};

export const useSearchPosts = (query) => {
  return useInfiniteQuery(
    [REACT_QUERY_KEYS.SEARCH_POSTS, query],
    ({ pageParam = 0 }) => {
      return callYupApi({
        method: 'GET',
        url: '/search/es/posts',
        params: {
          start: pageParam,
          searchText: query,
          limit: DEFAULT_FEED_PAGE_SIZE
        }
      })
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.length) return undefined;

        return sum(allPages.map((page) => page.length || 0));
      }
    }
  )
};

export const useSearchPeople = (query) => {
  const { data } = useQuery([REACT_QUERY_KEYS.SEARCH_PEOPLE, query], () =>
    callYupApi({
      method: 'GET',
      url: '/search/es/users',
      params: {
        searchText: query,
        limit: DEFAULT_SEARCH_SIZE
      }
    })
  );

  return data;
};

export const useSearchCollections = (query) => {
  const { data } = useQuery([REACT_QUERY_KEYS.SEARCH_COLLECTIONS, query], () =>
    callYupApi({
      method: 'GET',
      url: '/search/es/collections',
      params: {
        searchText: query,
        limit: DEFAULT_SEARCH_SIZE
      }
    })
  );

  return data;
}

export const useUserCollections = (userId) => {
  const { data } = useQuery([REACT_QUERY_KEYS.USER_COLLECTIONS, userId], () =>
    callYupApi({
      method: 'GET',
      url: `/accounts/${userId}/collections`
    })
  );

  return data;
};
