import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@mui/material'
import { YupButton } from '../Miscellaneous'
import useStyles from './AuthMethodButtonStyles'

const AuthMethodButton = ({ text, imageUrl, onClick }) => {
  const classes = useStyles()

  return (
    <YupButton
      size='large'
      variant='outlined'
      color='secondary'
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
