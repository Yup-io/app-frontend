import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ProfComp from './ProfComp.js';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function ProfPost(props) {
  const { url, postHOC: PostHOC } = props;
  const ProfPreview = (props) => <ProfComp url={url} />;
  return (
    <ErrorBoundary>
      <PostHOC component={ProfPreview} {...props} />
    </ErrorBoundary>
  );
}

ProfPost.propTypes = {
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(ProfPost);
