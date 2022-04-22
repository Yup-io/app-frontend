import React from 'react'
import PropTypes from 'prop-types'
import { LinearProgress } from '@mui/material'
import { Brand } from '../../utils/colors'

const LoadingBar = ({ isLoading, ...restProps }) => {
  return (
    isLoading &&
        (<LinearProgress
          {...restProps}
          sx={{ width: '100%' }}
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 999, width: '100%', backgroundColor: Brand.mint }}
        />
        )
  )
}

LoadingBar.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

export default LoadingBar
