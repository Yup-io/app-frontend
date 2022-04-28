import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@mui/material'

import useStyles from './AuthMethodButtonStyles'
import { YupButton } from '../Miscellaneous'

const AuthMethodButton = ({ text, imageUrl, onClick }) => {
  const classes = useStyles()

  return (
    <YupButton
      variant='outlined'
      color='primary'
      size='large'
      onClick={onClick}
      fullWidth
      className={classes.root}
    >
      <Typography className={classes.text}>
        {text}
      </Typography>
      <img
        alt={text}
        src={imageUrl}
        className={classes.icon}
      />
    </YupButton>
  )
}

AuthMethodButton.propTypes = {
  text: PropTypes.string,
  imageUrl: PropTypes.string,
  onClick: PropTypes.func
}

export default AuthMethodButton
