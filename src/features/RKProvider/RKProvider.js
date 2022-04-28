import React from 'react'
import PropTypes from 'prop-types'
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { WagmiProvider, chain } from 'wagmi'
import { providers } from 'ethers'

import '@rainbow-me/rainbowkit/dist/index.css'

const chains = [
  {...chain.mainnet, name: 'Ethereum'},
  {...chain.polygonMainnet, name: 'Polygon'}
]

const provider = ({ chainId }) => {
  let url = chain.mainnet.rpcUrls[0]
  const matchedChain = chains.find((item) => item.id === chainId)

  if (matchedChain && matchedChain.rpcUrls) {
    url = matchedChain.rpcUrls[0]
  }

  return new providers.JsonRpcProvider(url, chainId)
}

const wallets = getDefaultWallets({
  chains,
  appName: 'Yup'
})

const connectors = connectorsForWallets(wallets)

const RKProvider = ({ children }) => {
  return (
    <WagmiProvider
      autoConnect
      connectors={connectors}
      provider={provider}
    >
      <RainbowKitProvider chains={chains}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

RKProvider.propTypes = {
  children: PropTypes.node
}

export default RKProvider
