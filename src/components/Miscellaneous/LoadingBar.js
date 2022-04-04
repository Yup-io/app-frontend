import React from 'react'
import PropTypes from 'prop-types'
import { LinearProgress } from '@material-ui/core'
import Colors from '../../utils/colors'

const LoadingBar = ({ isLoading, ...restProps }) => {
  return (
    isLoading &&
        (<LinearProgress
          {...restProps}
          sx={{ width: '100%' }}
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 999, width: '100%', backgroundColor: Colors.green }}
        />
        )
  )
}

LoadingBar.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

export default LoadingBar
