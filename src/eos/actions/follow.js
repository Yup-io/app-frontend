import { pushEthMirrorTx, pushTwitterMirrorTx } from './push-transaction'
const { YUP_CONTRACT_ACCOUNT, YUP_ACCOUNT_MANAGER } = process.env

export async function follow (account, data, ethAuth) {
  const permission = ethAuth ? 'follow' : account.authority
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'follow',
        authorization: [{
          actor: account.name,
          permission
        }, {
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {
          ram_payer: YUP_ACCOUNT_MANAGER,
          follower: account.name,
          account_to_follow: data.accountToFollow
        }
      }
    ]
  }
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData)
  } else {
    await pushEthMirrorTx(ethAuth, txData)
  }
}

export async function unfollow (account, data, ethAuth) {
  const permission = ethAuth ? 'unfollow' : account.authority
  const txData = {
    actions: [
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'noop',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: YUP_CONTRACT_ACCOUNT,
        name: 'unfollow',
        authorization: [{
          actor: account.name,
          permission
        }, {
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }],
        data: {
          ram_payer: YUP_ACCOUNT_MANAGER,
          follower: account.name,
          account_to_unfollow: data.accountToUnfollow
        }
      }
    ]
  }
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData)
  } else {
    await pushEthMirrorTx(ethAuth, txData)
  }
}
