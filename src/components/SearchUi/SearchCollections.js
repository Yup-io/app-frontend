import { useSearchCollections } from '../../hooks/queries';
import { RecommendedCollections } from '../Collections';
import withSuspense from '../../hoc/withSuspense';

const SearchCollections = ({ searchQuery }) => {
  const collections = useSearchCollections(searchQuery);

  return collections.map((collection) => (
    <RecommendedCollections collection={collection} />
  ));
};

export default withSuspense()(SearchCollections);
