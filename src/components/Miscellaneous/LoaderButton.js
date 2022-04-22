import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, Button } from '@mui/material'

const LoaderButton = ({ color, variant, isLoading, buttonText, ...restProps }) => {
  return (
    <Button
      color={color}
      variant={variant}
      {...restProps}
    >
      {buttonText}
      {isLoading &&
        (<CircularProgress size={20}
          style={{ color: 'white', position: 'absolute', right: '3%' }}
        />
        )}
    </Button>
  )
}

LoaderButton.propTypes = {
  color: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  buttonText: PropTypes.string.isRequired
}

export default LoaderButton
