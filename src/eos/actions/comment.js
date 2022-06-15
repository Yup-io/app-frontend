import { pushEthMirrorTx, pushTwitterMirrorTx } from './push-transaction';
import { yupAccountManager, yupContractAccount } from '../../config';

export async function createcomv2(account, data, ethAuth) {
  const permission = ethAuth ? 'createcomv2' : account.authority;
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
        name: 'createcomv2',
        authorization: [
          {
            actor: yupAccountManager,
            permission: 'active'
          },
          {
            actor: account.name,
            permission
          }
        ],
        data: {
          ram_payer: yupAccountManager,
          postid: data.postid,
          author: account.name,
          timestamp: new Date().getTime(),
          comment: data.comment
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

export async function editcomment(account, data, ethAuth) {
  const permission = ethAuth ? 'editcomment' : account;
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
        name: 'editcom',
        authorization: [
          {
            actor: yupAccountManager,
            permission: 'active'
          },
          {
            actor: account.name,
            permission
          }
        ],
        data: {
          ram_payer: yupAccountManager,
          commentid: data.commentid,
          comment: data.comment,
          edit_timestamp: new Date().getTime()
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

export async function deletecom(account, data, ethAuth) {
  const permission = ethAuth ? 'editcomment' : account;
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
        name: 'deletecom',
        authorization: [
          {
            actor: yupAccountManager,
            permission: 'active'
          },
          {
            actor: yupAccountManager,
            permission: 'active'
          },
          {
            actor: account.name,
            permission
          }
        ],
        data: {
          ram_payer: yupAccountManager,
          commentid: data.commentid
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
