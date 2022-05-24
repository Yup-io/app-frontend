import { pushEthMirrorTx, pushTwitterMirrorTx } from './push-transaction'
import { yupAccountManager, yupContractAccount } from '../../config'

export async function follow (account, data, ethAuth) {
  const permission = ethAuth ? 'follow' : account.authority
  const txData = {
    actions: [
      {
        account: yupContractAccount,
        name: 'noop',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: yupContractAccount,
        name: 'follow',
        authorization: [{
          actor: account.name,
          permission
        }, {
          actor: yupAccountManager,
          permission: 'active'
        }],
        data: {
          ram_payer: yupAccountManager,
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
        account: yupContractAccount,
        name: 'noop',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }],
        data: {}
      },
      {
        account: yupContractAccount,
        name: 'unfollow',
        authorization: [{
          actor: account.name,
          permission
        }, {
          actor: yupAccountManager,
          permission: 'active'
        }],
        data: {
          ram_payer: yupAccountManager,
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
