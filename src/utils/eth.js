// import WalletConnectProvider from '@maticnetwork/walletconnect-provider'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { providers } from 'ethers'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
const { WALLET_CONNECT_BRIDGE, POLY_RPC_URL, POLY_CHAIN_ID } = process.env

export const getPriceProvider = () => new providers.JsonRpcProvider(POLY_RPC_URL)

export const getPolygonWeb3Modal = (backupRpc = null) => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        bridge: WALLET_CONNECT_BRIDGE,
        rpc: {
          [POLY_CHAIN_ID]: backupRpc || POLY_RPC_URL
        },
        callbacks: {
          onConnect: () => console.log('matic provider connected'),
          onDisconnect: () => console.log('matic provider disconnected')
        }
      }
    }
  }
  const maticWeb3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions // required
  })
  return maticWeb3Modal
}

export const getPolygonProvider = async (polygonWeb3Modal) => {
  try {
    const provider = await polygonWeb3Modal.connect()
    return provider
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getWeb3InstanceOfProvider = (provider) => new Web3(provider)

export const getConnector = async () => {
  try {
    const connector = new WalletConnect({ bridge: WALLET_CONNECT_BRIDGE, qrcodeModal: QRCodeModal })
    connector.rpcUrl = POLY_RPC_URL
    connector.chainId = Number(POLY_CHAIN_ID)
    return connector
  } catch (err) {
    throw err
  }
}
