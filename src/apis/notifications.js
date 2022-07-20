import callYupApi from './base_api';

export const apiSetNotificationSeenScatter = async (id, signature, eosname) =>
  callYupApi({
    url: '/notifications/seen',
    method: 'POST',
    data: { id, signature, eosname }
  });

export const apiSetNotificationSeenEth = async (id, signature, address) =>
  callYupApi({
    url: '/notifications/eth-mirror/seen',
    method: 'POST',
    data: { id, signature, address }
  });
