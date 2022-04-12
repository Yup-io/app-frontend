import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogTitle, Hidden, Typography } from '@material-ui/core'

import AuthMethodButton from '../../components/AuthMethodButton'
import { useWallet } from '../../contexts/WalletContext'

const AuthModal = ({ open, onClose }) => {
  const { connect: connectWallet } = useWallet()

  const handleAuthWithWallet = async () => {
    await connectWallet()
  }

  return (
    <Dialog
      open={open}
      fullWidth='md'
      onClose={onClose}
    >
      <DialogTitle>
        Sign Up / Login
      </DialogTitle>

      <DialogContent>

        {/* Hide text in small devices */}
        <Hidden smDown>
          <Typography>
            Earn money & clout for rating content anywhere on the internet. Get extra rewards for joining today.
          </Typography>
        </Hidden>

        <AuthMethodButton
          text='WalletConnect'
          imageUrl='/images/icons/wallet_connect.png'
          onClick={handleAuthWithWallet}
        />
      </DialogContent>
    </Dialog>
  )
}

AuthModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
}

export default AuthModal
