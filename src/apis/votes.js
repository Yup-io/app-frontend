import callYupApi from './base_api';

export const createVote = async ({url, postid, voter, like, rating, authInfo}) =>
  callYupApi({
    url: `/votes`,
    method: 'POST',
    data: { url, postid, voter, like, rating, ...authInfo }
  });

  export const editVote = async ({ voter, voteId, like, rating, authInfo}) =>
  callYupApi({
    url: `/votes/${voteId}`,
    method: 'POST',
    data: {  voter, like, rating, ...authInfo }
  });

  export const deleteVote = async ({ voteId, authInfo }) =>
  callYupApi({
    url: `/votes/${voteId}`,
    method: 'DELETE',
    data: {...authInfo}
  });