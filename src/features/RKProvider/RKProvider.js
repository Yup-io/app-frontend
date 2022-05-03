import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material'
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider, chain } from 'wagmi'
import { providers } from 'ethers'
import merge from 'lodash/merge'

import { alchemyApiKeys } from '../../config'

import '@rainbow-me/rainbowkit/dist/index.css'

const chains = [
  { ...chain.mainnet, name: 'Ethereum' },
  { ...chain.polygonMainnet, name: 'Polygon' }
]

const provider = ({ chainId }) => {
  if (alchemyApiKeys[chainId]) {
    return new providers.AlchemyProvider(chainId, alchemyApiKeys[chainId])
  }

  return null
}

const wallets = getDefaultWallets({
  chains,
  appName: 'Yup'
})

const connectors = connectorsForWallets(wallets)

const RKProvider = ({ children }) => {
  const { palette } = useTheme()
  const rkDefaultTheme = palette.mode === 'light' ? lightTheme() : darkTheme()
  const rkTheme = merge(rkDefaultTheme, {
    colors: {
      accentColor: palette.P500,
      modalBackground: `${palette.M500}44; backdrop-filter: blur(20px);`,
      modalBackdrop: `${palette.M800}88;`,
      modalTextSecondary: palette.M300,
      modalText: palette.M50
    },
    fonts: {
      body: 'Gilroy'
    },
    radii: {
      modal: '16px'
    }
  })

  return (
    <WagmiProvider
      autoConnect
      connectors={connectors}
      provider={provider}
    >
      <RainbowKitProvider
        chains={chains}
        theme={rkTheme}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}

RKProvider.propTypes = {
  children: PropTypes.node
}

export default RKProvider
