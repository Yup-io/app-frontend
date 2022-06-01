import { pushEthMirrorTx, pushTwitterMirrorTx } from './push-transaction';
import { yupAccountManager, yupContractAccount } from '../../config';

export async function createpost(account, data, ethAuth) {
  const permission = ethAuth ? 'createpostv3' : account.authority;
  const txData = {
    actions: [
      {
        account: yupContractAccount,
        name: 'noop',
        authorization: [
          {
            actor: yupAccountManager,
            permission: 'active'
          }
        ],
        data: {}
      },
      {
        account: yupContractAccount,
        name: 'createpostv3',
        authorization: [
          {
            actor: account.name,
            permission
          },
          {
            actor: yupAccountManager,
            permission: 'active'
          }
        ],
        data: {
          ram_payer: yupAccountManager,
          img_hash: data.imgHash,
          video_hash: data.videoHash,
          author: account.name,
          tag: 'general',
          timestamp: new Date().getTime(),
          caption: data.caption
        }
      }
    ]
  };
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData);
  } else {
    await pushEthMirrorTx(ethAuth, txData);
  }
}

export async function editpost(account, data, ethAuth) {
  const permission = ethAuth ? 'editpost' : account.authority;
  const txData = {
    actions: [
      {
        account: yupContractAccount,
        name: 'noop',
        authorization: [
          {
            actor: yupAccountManager,
            permission: 'active'
          }
        ],
        data: {}
      },
      {
        account: yupContractAccount,
        name: 'editpost',
        authorization: [
          {
            actor: account.name,
            permission
          },
          {
            actor: yupAccountManager,
            permission: 'active'
          }
        ],
        data: {
          ram_payer: yupAccountManager,
          img_hash: data.imgHash,
          video_hash: data.videoHash,
          tag: 'general',
          postid: data.postid,
          caption: data.caption
        }
      }
    ]
  };
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData);
  } else {
    await pushEthMirrorTx(ethAuth, txData);
  }
}

export async function deletepost(account, data, ethAuth) {
  const permission = ethAuth ? 'deletepost' : account.authority;
  const txData = {
    actions: [
      {
        account: yupContractAccount,
        name: 'noop',
        authorization: [
          {
            actor: yupAccountManager,
            permission: 'active'
          }
        ],
        data: {}
      },
      {
        account: yupContractAccount,
        name: 'deletepost',
        authorization: [
          {
            actor: account.name,
            permission
          },
          {
            actor: yupAccountManager,
            permission: 'active'
          }
        ],
        data: {
          ram_payer: yupAccountManager,
          postid: data.postid
        }
      }
    ]
  };
  if (localStorage.getItem('twitterMirrorInfo')) {
    await pushTwitterMirrorTx(txData);
  } else {
    await pushEthMirrorTx(ethAuth, txData);
  }
}
