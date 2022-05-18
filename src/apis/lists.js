import callYupApi from './base_api'

export const apiGetListOptions = async (params) =>
  callYupApi({
    url: '/v1/lists/listInfo',
    method: 'GET',
    params
  })
