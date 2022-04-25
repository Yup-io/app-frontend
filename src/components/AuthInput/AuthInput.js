import React from 'react'
import PropTypes from 'prop-types'
import { InputAdornment, OutlinedInput } from '@mui/material'
import IconNext from '@mui/icons-material/ArrowRightAlt'

import useStyles from './AuthInputStyles'

const AuthInput = ({ onEnter, ...restProps }) => {
  const classes = useStyles()

  const handleEmailKeyDown = (e) => {
    if (e.key !== 'Enter') {
      return
    }

    onEnter()
    e.preventDefault()
  }

  return (
    <OutlinedInput
      fullWidth
      className={classes.root}
      variant='outlined'
      onKeyDown={handleEmailKeyDown}
      endAdornment={
        <InputAdornment
          position='end'
          onClick={onEnter}
        >
          <IconNext className={classes.nextArrow} />
        </InputAdornment>
      }
      {...restProps}
    />
  )
}

AuthInput.propTypes = {
  onEnter: PropTypes.func
}

export default AuthInput
