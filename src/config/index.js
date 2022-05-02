export const polygonConfig = {
  rpcUrl: process.env.POLY_RPC_URL,
  chainId: Number(process.env.POLY_CHAIN_ID),
  backupRpcUrls: process.env.POLY_BACKUP_RPC_URL.split(',')
}

export const ethereumConfig = {
  chainId: Number(process.env.ETH_CHAIN_ID)
}

export const alchemyApiKeys = {
  [polygonConfig.chainId]: process.env.ALCHEMY_API_KEY_POLYGON,
  [ethereumConfig.chainId]: process.env.ALCHEMY_API_KEY_ETHEREUM
}

export const apiBaseUrl = process.env.BACKEND_API

export const walletConnectBridge = process.env.WALLET_CONNECT_BRIDGE
