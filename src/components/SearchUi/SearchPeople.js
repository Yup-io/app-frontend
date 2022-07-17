import { useSearchPeople } from '../../hooks/queries';
import withSuspense from '../../hoc/withSuspense';
import UserConnection from '../UserConnection/UserConnection';
import { LOADER_TYPE } from '../../constants/enum';
import { DEFAULT_SEARCH_SIZE } from '../../config';

const SearchPeople = ({ searchQuery }) => {
  const people = useSearchPeople(searchQuery);

  return people.map((user) => (
    <UserConnection user={user}/>
  ));
};

export default withSuspense(LOADER_TYPE.USER_CONNECTION, DEFAULT_SEARCH_SIZE)(SearchPeople);
