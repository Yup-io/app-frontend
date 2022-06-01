import Typography from '@mui/material/Typography';
import React from 'react';
import capitalize from 'lodash/capitalize';
import { FlexBox } from '../styles';
import FilterBar from './FilterBar';
import { useFilters } from './LeaderboardContainer';

const Header = () => {
  const { filterObject, selectedCategory } = useFilters();

  const categoryObject = filterObject.categories.find(
    (item) => item.name === selectedCategory
  );
  const subjectTitle =
    filterObject.subject.name === 'nfts'
      ? filterObject.subject.displayName
      : capitalize(filterObject.subject.displayName);
  let title = `${capitalize(categoryObject.displayName)} ${subjectTitle}`;

  if (filterObject.location.name !== 'all') {
    title += ` ${filterObject.preposition} ${capitalize(
      filterObject.location.displayName
    )}`;
  }

  return (
    <div className="Tour-LeaderboardMenu">
      <Typography variant="body2" sx={{ opacity: 0.3 }}>
        Leaderboard
      </Typography>
      <Typography variant="h3">{title}</Typography>
      <FlexBox justifyContent="space-between" mt={4}>
        <FilterBar />
        {/* Implement Search Bar */}
      </FlexBox>
    </div>
  );
};

export default Header;
