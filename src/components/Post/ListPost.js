import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ListPreview from '../YupLeaderboard/ListPreview';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function ListPost(props) {
  const {
    previewData,
    url,
    postHOC: PostHOC,
    quantiles,
    rank,
    rankCategory
  } = props;

  const MIRROR_XYZ_REGEX =
    /^((http:|https:)([/][/]))?(www.)?[a-z]*?.mirror.xyz(\/)?[^/]*[/]?$/;
  let imageUrl = previewData && previewData.img;

  if (!imageUrl) {
    imageUrl = 'https://api.faviconkit.com/app.yup.io/64';
  }

  if (MIRROR_XYZ_REGEX.test(url)) {
    imageUrl = 'https://mirror.xyz/images/social.png';
  }

  const ListComp = (_props) => (
    <ListPreview
      previewData={previewData}
      description={previewData && previewData.description}
      image={imageUrl}
      title={previewData && previewData.title}
      url={url}
      quantiles={quantiles}
      rankCategory={rankCategory}
      rank={rank}
    />
  );
  return (
    <ErrorBoundary>
      <PostHOC component={ListComp} {...props} />
    </ErrorBoundary>
  );
}

ListPost.propTypes = {
  previewData: PropTypes.object,
  quantiles: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired,
  rankCategory: PropTypes.string,
  rank: PropTypes.number
};

export default memo(ListPost);
