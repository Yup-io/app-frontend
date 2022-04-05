import callYupApi from './base_api'

export const apiGetChallenge = async (params) =>
  callYupApi({
    url: '/v1/eth/challenge',
    method: 'GET',
    params
  })
