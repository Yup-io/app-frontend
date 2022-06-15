import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import { webAppUrl } from '../../config';

const ConditionalLinkWrapper = ({ children, href, ...restProps }) => {
  if (!href) return null;
  const isNativeYupPost = href.startsWith(webAppUrl) || href.startsWith('/');
  return isNativeYupPost ? (
    <Link {...restProps} href={href.replace(webAppUrl, '')}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" {...restProps}>
      {children}
    </a>
  );
};

ConditionalLinkWrapper.propTypes = {
  children: PropTypes.object.isRequired,
  href: PropTypes.string.isRequired
};

export default ConditionalLinkWrapper;
