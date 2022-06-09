import { useQuery } from 'react-query'
import { REACT_QUERY_KEYS } from '../constants/enum'
import callYupApi from '../apis/base_api'

export const useCollection = (id) => {
  const { data } = useQuery(
    [REACT_QUERY_KEYS.YUP_COLLECTION, id],
    () => callYupApi({
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
    () => callYupApi({
      url: '/collections/recommended',
      method: 'GET',
      params
    })
  );
  return data;
}
