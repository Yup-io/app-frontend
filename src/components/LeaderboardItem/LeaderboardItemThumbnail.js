import {
  LeaderboardItemThumbnailImage,
  LeaderboardItemThumbnailRoot,
  LeaderboardItemThumbnailVideo
} from './styles';

const LeaderboardItemThumbnail = ({ url }) => {
  const isVideo = url.includes('.mp4');

  return (
    <LeaderboardItemThumbnailRoot>
      {isVideo ? (
        <LeaderboardItemThumbnailVideo
          url={url}
          target="_blank"
          playing
          muted
          loop
          playsinline
        />
      ) : (
        <LeaderboardItemThumbnailImage src={url} />
      )}
    </LeaderboardItemThumbnailRoot>
  );
};

export default LeaderboardItemThumbnail;
