import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'

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
  const [connection, setConnection] = useState(null)

  const connectWallet = useCallback(async () => {
    let walletConnection = connection

    if (!walletConnection) {
      walletConnection = await web3Modal.connect()

      setConnection(walletConnection)
    }

    return new ethers.providers.Web3Provider(walletConnection)
  }, [connection])

  useEffect(() => {
    if (connection === null) {
      return
    }

    connection.on('disconnect', ({ code, message }) => {
      setConnection(null)
    })
  }, [connection])

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
