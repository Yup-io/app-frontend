import React from 'react';
import PropTypes from 'prop-types';
import wallet from '../../eos/scatter/scatter.wallet';

export default function PrivateListItem({ account, children }) {
  const isLoggedIn =
    account || (wallet.scatter && wallet.scatter.wallet === 'ScatterExtension');
  return isLoggedIn ? <> {children} </> : null;
}

PrivateListItem.propTypes = {
  account: PropTypes.object,
  children: PropTypes.node.isRequired
};
