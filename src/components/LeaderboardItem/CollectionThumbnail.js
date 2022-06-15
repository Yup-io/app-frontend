import { useCollection } from '../../hooks/queries';
import {
  LeaderboardItemThumbnailImage,
  LeaderboardItemThumbnailRoot
} from './styles';
import withSuspense from '../../hoc/withSuspense';
import { LOADER_TYPE } from '../../constants/enum';

const CollectionThumbnail = ({ url }) => {
  const segments = url.split('/');
  const collection = useCollection(segments[5]);
  const { posts } = collection;
  const thumbnails = posts.map((item) => item?.previewData?.img);

  return (
    <LeaderboardItemThumbnailRoot>
      <LeaderboardItemThumbnailImage src={thumbnails} />
    </LeaderboardItemThumbnailRoot>
  );
};

export default withSuspense(LOADER_TYPE.DEFAULT)(CollectionThumbnail);
