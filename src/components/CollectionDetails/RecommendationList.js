import { useRecommendation } from '../../hooks/queries';
import { FlexBox } from '../styles';
import RecommendedCollections from '../Collections/RecommendedCollections';

const RecommendationList = ({ collection }) => {
  const { name, description, _id: id } = collection;
  const recommendation = useRecommendation({ name, description, id });

  return (
    <FlexBox flexDirection="column" className="Tour-RecommendedCollections">
      {recommendation.map((post) => (
        <RecommendedCollections key={post._id} collection={post} />
      ))}
    </FlexBox>
  );
};

export default RecommendationList;
