import Typography from '@mui/material/Typography';
import React from 'react';
import capitalize from 'lodash/capitalize';
import { FlexBox } from '../styles';
import FilterBar from './FilterBar';
import { useFilters } from './LeaderboardContainer';
import { Container } from '@mui/material';

const Header = () => {
  const { filterObject } = useFilters();

  let title = filterObject.subject.name.includes('nft')
    ? filterObject.subject.displayName
    : capitalize(filterObject.subject.displayName);

  if (filterObject.location.name !== 'all') {
    title += ` ${filterObject.preposition} ${capitalize(
      filterObject.location.displayName
    )}`;
  }

  return (
    <Container className="Tour-LeaderboardMenu">
      <Typography variant="body2" sx={{ opacity: 0.3 }}>
        Leaderboard
      </Typography>
      <Typography variant="h3">{title}</Typography>
      <FlexBox justifyContent="space-between" mt={4}>
        <FilterBar />
        {/* Implement Search Bar */}
      </FlexBox>
    </Container>
  );
};

export default Header;
