import SearchPage from '../_pages/Search/Search';
import TutorialsProvider from '../providers/TutorialsProvider'
import { SEARCH_TUTORIAL_STEPS } from '../constants/data'

const Search = () => {
  return (
    <TutorialsProvider steps={SEARCH_TUTORIAL_STEPS}>
      <SearchPage />
    </TutorialsProvider>
  );
};

export default Search;
