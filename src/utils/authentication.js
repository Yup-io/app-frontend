import scatter from '../eos/scatter/scatter.wallet';

export async function getAuth(account) {
  let auth;
  if (!scatter || !scatter.connected) {
    auth = account.authInfo;
  } else {
    auth = await scatter.scatter.getAuthToken();
  }
  return auth;
}
