import React from 'react';
import { useRouter } from 'next/router'
import useYupListFilters from '../../hooks/useYupListFilters'
import Header from './Header'
import FeedList from './FeedList'
import { ContainerRoot } from './styles'
import LoadingSpin from '../../LoadingSpin'

// Context for filters
const FilterContext = React.createContext(null);
export const useFilters = () => React.useContext(FilterContext);

const LeaderboardContainer = () => {
  const { query } = useRouter();
  const { platform, subject, category } = query;

  const filters = useYupListFilters({ platform, subject, category });

  if (!filters) {
    return (
      <ContainerRoot>
        <LoadingSpin />
      </ContainerRoot>
    );
  }

  return (
    <FilterContext.Provider value={filters}>
      <ContainerRoot>
        <Header />
        <FeedList />
      </ContainerRoot>
    </FilterContext.Provider>
  );
};

export default LeaderboardContainer;
