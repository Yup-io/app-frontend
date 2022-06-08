import { LeaderboardItemRank, LeaderboardItemRoot } from './styles';
import AudisContent from './AudisContent';
import { isMirrorUrl } from '../../utils/helpers';
import {
  MIRROR_THUMBNAIL_IMAGE,
  YUP_THUMBNAIL_IMAGE
} from '../../constants/const';
import LeaderboardItemThumbnail from './LeaderboardItemThumbnail';
import LeaderboardItemTitle from './LeaderboardItemTitle';
import VoteComp from '../VoteComp/VoteComp';

const LeaderboardItem = ({ data, rank }) => {
  const { previewData, caption, quantiles, weights, rating } = data;
  const { trackId, ownerId, img, url, title } = previewData;

  const isAudiusPost = Boolean(trackId) || Boolean(ownerId);
  const thumbnailUrl = img
    ? img
    : isMirrorUrl(caption)
    ? MIRROR_THUMBNAIL_IMAGE
    : YUP_THUMBNAIL_IMAGE;

  return (
    <LeaderboardItemRoot>
      <LeaderboardItemRank variant="h6">{rank}</LeaderboardItemRank>
      {isAudiusPost ? (
        <AudisContent id={trackId} ownerId={ownerId} />
      ) : (
        <>
          <LeaderboardItemThumbnail url={thumbnailUrl} />
          <LeaderboardItemTitle url={url} title={title} />
        </>
      )}
      <VoteComp
        postInfo={{ post: data }}
        caption={caption}
        postid={data._id.postid}
        rating={rating}
        weights={weights}
        quantiles={quantiles}
      />
    </LeaderboardItemRoot>
  );
};

export default LeaderboardItem;
