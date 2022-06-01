import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ProfComp from './ProfComp.js';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function ProfPost(props) {
  const { caption, postHOC: PostHOC } = props;
  const ProfPreview = (props) => <ProfComp caption={caption} />;
  return (
    <ErrorBoundary>
      <PostHOC component={ProfPreview} {...props} />
    </ErrorBoundary>
  );
}

ProfPost.propTypes = {
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(ProfPost);
