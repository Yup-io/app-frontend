import { backendHost } from '../../config'

export const mainnet = {
  blockchain: 'eos',
  protocol: 'https',
  host: backendHost,
  port: 443,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}

export const localnet = {
  blockchain: 'eos',
  protocol: 'http',
  host: 'localhost',
  port: 8888,
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
}

export const testnet = {
  blockchain: 'eos',
  protocol: 'https',
  host: backendHost,
  port: 443,
  chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
}
