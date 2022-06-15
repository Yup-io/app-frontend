import callYupApi from './base_api';

export const apiGetOAuthChallenge = async () =>
  callYupApi({
    url: '/v1/auth/oauth-challenge',
    method: 'POST',
    data: {
      domain: 'yup.io'
    }
  });

export const apiGetTwitterAuthInfo = async (
  verificationToken,
  verificationId,
  oauthReferrer
) =>
  callYupApi({
    url: '/v1/auth/twitter',
    method: 'POST',
    data: {
      verificationToken,
      verificationId,
      oauthReferrer
    }
  });

export const apiInviteEmail = async (email) =>
  callYupApi({
    url: '/v1/auth/invite_mobile',
    method: 'POST',
    data: { email }
  });
