import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { polygonConfig, walletConnectBridge } from '../config'
import { useSnackbar } from 'notistack'
import { ERROR_NOT_POLYGON_NETWORK } from '../constants/messages'

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
  const { enqueueSnackbar } = useSnackbar()

  const connectWallet = useCallback(async () => {
    let walletConnection = connection

    if (!walletConnection) {
      walletConnection = await web3Modal.connect()

      setConnection(walletConnection)
    }

    const ethersProvider = new ethers.providers.Web3Provider(walletConnection)
    const network = await ethersProvider.getNetwork()

    if (network.chainId !== polygonConfig.chainId) {
      enqueueSnackbar(
        ERROR_NOT_POLYGON_NETWORK,
        { variant: 'error' }
      )
    }

    return ethersProvider
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
