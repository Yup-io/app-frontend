import callYupApi from './base_api';

export const apiGetChallenge = async (params) =>
  callYupApi({
    url: '/v1/eth/challenge',
    method: 'GET',
    params
  });

export const apiVerifyChallenge = async (address, signature) =>
  callYupApi({
    url: '/v1/eth/challenge/verify',
    method: 'POST',
    data: { address, signature }
  });

export const apiCheckWhitelist = async (address) =>
  callYupApi({
    url: `/v1/eth/whitelist/${address}`
  });
