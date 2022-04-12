import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { polygonConfig, walletConnectBridge } from '../config'

const defaultContext = {
  connect: () => {}
}

const WalletContext = React.createContext(defaultContext)

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        bridge: walletConnectBridge,
        rpc: {
          [polygonConfig.chainId]: polygonConfig.rpcUrl
        }
      }
    }
  }
})

export const WalletContextProvider = ({ children }) => {
  const connectWallet = useCallback(async () => {
    await web3Modal.connect()
  }, [])

  return (
    <WalletContext.Provider
      value={{
        connect: connectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

WalletContextProvider.propTypes = {
  children: PropTypes.elementType
}

export default WalletContext

export const useWallet = () => React.useContext(WalletContext)
