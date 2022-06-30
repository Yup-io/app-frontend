import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ArticlePreview from '../LinkPreview/ArticlePreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function ArticlePost(props) {
  const {
    previewData,
    postHOC: PostHOC,
    quantiles,
    rankCategory,
    url
  } = props;

  const ArticleComp = (_props) => (
    <ArticlePreview
      description={previewData && previewData.description}
      image={previewData?.img || DEFAULT_POST_IMAGE}
      title={previewData && previewData.title}
      url={url}
      quantiles={quantiles}
      rankCategory={rankCategory}
    />
  );
  return (
    <ErrorBoundary>
      <PostHOC component={ArticleComp} {...props} />
    </ErrorBoundary>
  );
}

ArticlePost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  rankCategory: PropTypes.string
};

export default memo(ArticlePost);
