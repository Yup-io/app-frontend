import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import YupButton from './YupButton';

const LoaderButton = ({
  size,
  color,
  variant,
  isLoading,
  buttonText,
  ...restProps
}) => {
  return (
    <YupButton size={size} color={color} variant={variant} {...restProps}>
      {buttonText}
      {isLoading && (
        <CircularProgress
          size={20}
          style={{ color: 'white', position: 'absolute', right: '3%' }}
        />
      )}
    </YupButton>
  );
};

LoaderButton.propTypes = {
  color: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  buttonText: PropTypes.string.isRequired
};

export default LoaderButton;
