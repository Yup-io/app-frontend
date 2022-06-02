import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ObjectPreview from '../LinkPreview/ObjectPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function ObjectPost(props) {
  const {
    previewData,
    postHOC: PostHOC,
    quantiles,
    rankCategory,
    caption
  } = props;

  const ObjectComp = (_props) => (
    <ObjectPreview
      description={previewData && previewData.description}
      image={previewData && previewData.img}
      title={previewData && previewData.title}
      url={previewData && previewData.url}
      caption={caption}
      quantiles={quantiles}
      rankCategory={rankCategory}
    />
  );
  return (
    <ErrorBoundary>
      <PostHOC component={ObjectComp} {...props} />
    </ErrorBoundary>
  );
}

ObjectPost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  rankCategory: PropTypes.string
};

export default memo(ObjectPost);
