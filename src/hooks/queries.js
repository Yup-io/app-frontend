import { useQuery } from 'react-query';
import { REACT_QUERY_KEYS } from '../constants/enum';
import callYupApi from '../apis/base_api';

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
