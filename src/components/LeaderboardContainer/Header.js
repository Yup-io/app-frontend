import Typography from '@mui/material/Typography'
import React from 'react'
import { FlexBox } from '../styles'
import FilterBar from './FilterBar'

const Header = () => {
  return (
    <div className="Tour-LeaderboardMenu">
      <Typography variant="body2" sx={{ opacity: 0.3 }}>
        Leaderboard
      </Typography>
      <Typography variant="h3">
        Dynamic Title Should Come Here.
      </Typography>
      <FlexBox justifyContent="space-between" mt={4}>
        <FilterBar />
        {/* Implement Search Bar */}
      </FlexBox>
    </div>
  );
};

export default Header;
