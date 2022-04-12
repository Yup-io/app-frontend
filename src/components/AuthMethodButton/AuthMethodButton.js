import React from 'react'
import PropTypes from 'prop-types'

import { Button, Typography } from '@material-ui/core'

import useStyles from './AuthMethodButtonStyles'

const AuthMethodButton = ({ text, imageUrl, onClick }) => {
  const classes = useStyles()

  return (
    <Button
      variant='outlined'
      size='large'
      onClick={onClick}
      fullWidth
    >
      <Typography align='left'>
        WalletConnect
      </Typography>
      <img
        alt={text}
        src={imageUrl}
        className={classes.icon}
      />
    </Button>
  )
}

AuthMethodButton.propTypes = {
  text: PropTypes.string,
  imageUrl: PropTypes.string,
  onClick: PropTypes.func
}

export default AuthMethodButton
