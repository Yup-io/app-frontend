import React, { memo } from 'react';
import PropTypes from 'prop-types';
import TallLinkPreview from '../LinkPreview/TallLinkPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function TallPreviewPost(props) {
  const { previewData, url, postHOC: PostHOC } = props;

  const TallPreviewComp = (_props) => (
    <TallLinkPreview
      description={previewData && previewData.description}
      image={previewData && previewData.img}
      title={previewData && previewData.title}
      url={url}
    />
  );

  return (
    <ErrorBoundary>
      <PostHOC component={TallPreviewComp} {...props} />
    </ErrorBoundary>
  );
}

TallPreviewPost.propTypes = {
  previewData: PropTypes.object,
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(TallPreviewPost);
