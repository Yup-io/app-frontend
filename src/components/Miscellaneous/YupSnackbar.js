import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Snackbar } from '@mui/material';

const YupSnackbar = ({
  open,
  width,
  autoHideDuration,
  onClose,
  action,
  anchorOrigin,
  ContentProps,
  message,
  leftAdornment,
  rightAdornment,
  ...restProps
}) => {
  return (
    <Snackbar
      open={open}
      width={width}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      action={action}
      message={
        <Grid container justifyContent="center" align="center">
          {leftAdornment}
          {message}
          {rightAdornment}
        </Grid>
      }
      anchorOrigin={anchorOrigin}
      ContentProps={ContentProps}
      {...restProps}
    />
  );
};

YupSnackbar.propTypes = {
  open: PropTypes.bool,
  width: PropTypes.number,
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  action: PropTypes.element,
  anchorOrigin: PropTypes.object,
  ContentProps: PropTypes.object,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  leftAdornment: PropTypes.element,
  rightAdornment: PropTypes.element
};

export default YupSnackbar;
