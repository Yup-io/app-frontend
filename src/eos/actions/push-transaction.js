import axios from 'axios';
import { Api, JsonRpc } from 'eosjs2';
import { JsSignatureProvider } from 'eosjs2/dist/eosjs-jssig';
import fetch from 'node-fetch';
import { apiBaseUrl, eosConfig } from '../../config';

const signatureProvider = new JsSignatureProvider([]);

const rpc = new JsonRpc(eosConfig.apiUrl, { fetch });
const api = new Api({ rpc, signatureProvider });

export async function pushEthMirrorTx(ethAuth, txData) {
  const serializedTxData = await api.transact(txData, {
    blocksBehind: 3,
    expireSeconds: 60,
    broadcast: false,
    sign: false
  });
  const deserializedTx = api.deserializeTransaction(
    serializedTxData.serializedTransaction
  );
  await axios.post(`${apiBaseUrl}/transaction/eth-mirror`, {
    transaction: deserializedTx,
    signature: ethAuth.signature,
    address: ethAuth.address
  });
}

export async function pushTwitterMirrorTx(txData) {
  const serializedTxData = await api.transact(txData, {
    blocksBehind: 3,
    expireSeconds: 60,
    broadcast: false,
    sign: false
  });
  const deserializedTx = api.deserializeTransaction(
    serializedTxData.serializedTransaction
  );
  await axios.post(`${apiBaseUrl}/transaction/twitter`, {
    transaction: deserializedTx,
    oauthToken: JSON.parse(localStorage.getItem('twitterMirrorInfo')).token
  });
}
