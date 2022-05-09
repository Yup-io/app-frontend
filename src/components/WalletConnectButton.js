import React from 'react'
import PropTypes from 'prop-types'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import AuthMethodButton from './AuthMethodButton'

const WalletConnectButton = ({ onClick }) => {
  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <AuthMethodButton
          text='ConnectWallet'
          imageUrl='/images/icons/wallet_connect.png'
          onClick={(e) => {
            onClick(e)
            openConnectModal()
          }}
        />
      )}
    </ConnectButton.Custom>
  )
}

WalletConnectButton.propTypes = {
  onClick: PropTypes.func
}

export default WalletConnectButton
