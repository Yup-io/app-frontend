import { pushEthMirrorTx, pushTwitterMirrorTx } from './push-transaction'
const { YUP_CONTRACT_ACCOUNT, YUP_ACCOUNT_MANAGER } = process.env

export async function createcomv2 (account, data, ethAuth) {
  const permission = ethAuth ? 'createcomv2' : account.authority
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
        name: 'createcomv2',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        } ],
        data: {
          ram_payer: YUP_ACCOUNT_MANAGER,
          postid: data.postid,
          author: account.name,
          timestamp: (new Date()).getTime(),
          comment: data.comment
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

export async function editcomment (account, data, ethAuth) {
  const permission = ethAuth ? 'editcomment' : account
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
        name: 'editcom',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: YUP_ACCOUNT_MANAGER,
          commentid: data.commentid,
          comment: data.comment,
          edit_timestamp: (new Date()).getTime()
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

export async function deletecom (account, data, ethAuth) {
  const permission = ethAuth ? 'editcomment' : account
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
        name: 'deletecom',
        authorization: [{
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }, {
          actor: YUP_ACCOUNT_MANAGER,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: YUP_ACCOUNT_MANAGER,
          commentid: data.commentid
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
