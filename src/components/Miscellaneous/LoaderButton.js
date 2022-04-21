import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress, Button } from '@mui/material'

const LoaderButton = ({ isLoading, buttonText, variant, ...restProps }) => {
  return (
    <Button
      {...restProps}
      variant={variant}
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
  isLoading: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired
}

export default LoaderButton
