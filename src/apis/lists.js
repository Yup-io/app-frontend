import callYupApi from './base_api'

export const apiGetListOptions = async (params) =>
  callYupApi({
    url: '/v1/lists/listInfo',
    method: 'GET',
    params
  });

export const apiGetLists = async (params) =>
  callYupApi({
    url: '/v1/lists',
    method: 'GET',
    params
  });
