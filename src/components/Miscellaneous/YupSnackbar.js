import React from 'react'
import PropTypes from 'prop-types'
import { Snackbar } from '@material-ui/core'

const YupSnackbar = ({ open, width, autoHideDuration, onClose, action, anchorOrigin, ContentProps, message, leftAdornment, rightAdornment, ...restProps }) => {
  return (
    <Snackbar
      open={open}
      width={width}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      action={action}
      anchorOrigin={anchorOrigin}
      ContentProps={ContentProps}
      {...restProps}
    >
      {leftAdornment}
      {message}
      {rightAdornment}
    </Snackbar>
  )
}

YupSnackbar.propTypes = {
  open: PropTypes.bool,
  width: PropTypes.number,
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  action: PropTypes.element,
  anchorOrigin: PropTypes.object,
  ContentProps: PropTypes.object,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  leftAdornment: PropTypes.string,
  rightAdornment: PropTypes.string
}

export default YupSnackbar
