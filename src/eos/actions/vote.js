import { pushEthMirrorTx, pushTwitterMirrorTx } from './push-transaction'
import { yupAccountManager, yupContractAccount, yupCreator } from '../../config'

export async function createvote (account, data, ethAuth) {
  const permission = ethAuth ? 'createvotev2' : account.authority
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
        name: 'createvotev2',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: yupAccountManager,
          voter: account.name,
          postid: data.postid,
          rating: data.rating,
          like: !!data.like,
          category: data.category
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

export async function postvotev3 (account, data, ethAuth) {
  const permission = ethAuth ? 'postvotev3' : account.authority
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
        name: 'postvotev3',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: yupAccountManager,
          postid: data.postid,
          author: yupCreator,
          caption: data.caption || '',
          img_hash: data.imgHash || '',
          video_hash: data.videoHash || '',
          tag: data.tag || 'general',
          voter: account.name,
          like: data.like,
          category: data.category,
          rating: data.rating
        }
      }]
  }
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData)
  } else {
    await pushEthMirrorTx(ethAuth, txData)
  }
}

export async function postvotev4 (account, data, ethAuth) {
  const permission = ethAuth ? 'postvotev4' : account.authority
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
        name: 'postvotev4',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: yupAccountManager,
          postid: data.postid,
          author: yupCreator,
          caption: data.caption || '',
          img_hash: data.imgHash || '',
          video_hash: data.videoHash || '',
          tag: data.tag || 'general',
          voteid: data.voteid,
          voter: account.name,
          like: data.like,
          category: data.category,
          rating: data.rating
        }
      }]
  }
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData)
  } else {
    await pushEthMirrorTx(ethAuth, txData)
  }
}

export async function createvotev4 (account, data, ethAuth) {
  const permission = ethAuth ? 'createvotev4' : account.authority
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
        name: 'createvotev4',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: yupAccountManager,
          voteid: data.voteid,
          voter: account.name,
          postid: data.postid,
          like: !!data.like,
          category: data.category,
          rating: data.rating || 1
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

export async function editvote (account, data, ethAuth) {
  const permission = ethAuth ? 'editvotev2' : account.authority
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
        name: 'editvotev2',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: yupAccountManager,
          voteid: data.voteid,
          like: !!data.like,
          rating: data.rating,
          category: data.category
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

export async function deletevote (account, data, ethAuth) {
  const permission = ethAuth ? 'deletevote' : account.authority
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
        name: 'deletevote',
        authorization: [{
          actor: yupAccountManager,
          permission: 'active'
        }, {
          actor: account.name,
          permission
        }],
        data: {
          ram_payer: yupAccountManager,
          voteid: data.voteid
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
