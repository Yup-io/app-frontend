import axios from 'axios';
import ScatterJS, { Network } from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';
import { mainnet, testnet } from './scatter.config';
import { JsonRpc } from 'eosjs2';

import { apiBaseUrl, isProdEnv } from '../../config';

const networkConfig = apiBaseUrl === 'https://api.yup.io' ? mainnet : testnet;

const network = Network.fromJson(networkConfig);
const rpc = new JsonRpc(network.fullhost());

class ScatterWallet {
  constructor() {
    this.scatter = null;
    this.identity = null;
    this.connected = false;
    this.eos = null;
    this.rpc = rpc;
  }

  async detect(updateScatter, scatterInstall) {
    try {
      const connected = await ScatterJS.scatter.connect('YupApp');

      if (!connected) {
        return;
      }
      this.connected = connected;

      this.scatter = ScatterJS.scatter;
      window.scatter = null;

      ScatterJS.plugins(new ScatterEOS());

      if (this.identity == null) {
        const identity = await this.scatter.getIdentity({
          accounts: [networkConfig]
        });
        if (identity.length === 0) {
          throw Error('No Yup identities found');
        }

        this.identity = {
          name: identity.accounts[0].name,
          authority: identity.accounts[0].authority
        };

        if (window.analytics) {
          window.analytics.identify({ userId: this.identity.name });
        }

        // Add new account to backend if it doesn't exist
        try {
          console.log(apiBaseUrl, 'apiBaseUrl');
          await axios.get(`${apiBaseUrl}/accounts/${this.identity.name}`);
        } catch (e) {
          if (e.response && e.response.data.statusCode === 404) {
            axios.post(`${apiBaseUrl}/accounts/${this.identity.name}`);
          }
        }

        if (this.scatter && this.scatter.isExtension) {
          this.eos = this.scatter.eos(networkConfig, Eos, {});
          updateScatter(this.scatter, this.identity);
          scatterInstall(true);
        }
      }
    } catch (e) {
      console.log(e, 'scatter-error');
    }
  }
}

const wallet = new ScatterWallet();
export default wallet;
