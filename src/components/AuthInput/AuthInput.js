import React from 'react';
import PropTypes from 'prop-types';
import { YupInput } from '../Miscellaneous';

const AuthInput = ({ onEnter, placeholder, ...restProps }) => {
  const handleEmailKeyDown = (e) => {
    if (e.key !== 'Enter') {
      return;
    }

    onEnter();
    e.preventDefault();
  };

  return (
    <YupInput
      fullWidth
      placeholder={placeholder}
      onKeyDown={handleEmailKeyDown}
      onSubmit={onEnter}
      {...restProps}
    />
  );
};

AuthInput.propTypes = {
  onEnter: PropTypes.func,
  placeholder: PropTypes.string
};

export default AuthInput;
