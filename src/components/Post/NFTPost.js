import React, { memo } from 'react';
import PropTypes from 'prop-types';
import NFTPreview from '../LinkPreview/NFTPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { defaultPostImageUrl } from '../../config';

function NFTPost(props) {
  const {
    previewData,
    postHOC: PostHOC,
    quantiles,
    rankCategory,
    caption,
    postid
  } = props;

  const ObjectComp = (_props) => (
    <NFTPreview
      previewData={previewData}
      description={previewData && previewData.description}
      image={previewData?.img || defaultPostImageUrl}
      title={previewData && previewData.title}
      mimeType={previewData && previewData.mimeType}
      url={previewData && previewData.url}
      caption={caption}
      quantiles={quantiles}
      rankCategory={rankCategory}
      postid={postid}
    />
  );
  return (
    <ErrorBoundary>
      <PostHOC component={ObjectComp} {...props} />
    </ErrorBoundary>
  );
}

NFTPost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.any.isRequired,
  rankCategory: PropTypes.string,
  postid: PropTypes.string
};

export default memo(NFTPost);
