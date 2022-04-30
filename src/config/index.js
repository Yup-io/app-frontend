export const polygonConfig = {
  rpcUrl: process.env.POLY_RPC_URL,
  chainId: Number(process.env.POLY_CHAIN_ID),
  backupRpcUrls: process.env.POLY_BACKUP_RPC_URL.split(',')
}

export const apiBaseUrl = process.env.BACKEND_API

export const walletConnectBridge = process.env.WALLET_CONNECT_BRIDGE
