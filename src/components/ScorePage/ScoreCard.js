import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { connect } from 'react-redux';
import { Brand, Other } from '../../utils/colors';
import CountUp from 'react-countup';
import { useThemeMode } from '../../contexts/ThemeModeContext';

const CustomPaper = styled(Paper)(
  ({ theme }) => `
    background-image: url(${'/images/graphics/scorecard_bg.svg'}); 
    background-repeat: no-repeat; 
    background-size: cover;
    border-radius: 18px;
    width: 600px;
    padding: 20px;
  `
);

const CustomAvatar = styled(Avatar)(
  ({ theme }) => `
    cursor: pointer;
    background-color: ${theme.palette.M100_OP1};
    :hover {
      background-color: ${theme.palette.M500_OP1};
    }
  `
);
const scoreToColor = (score) => {
  return score >= 80 && score <= 100
    ? Brand.mint
    : score >= 60 && score <= 80
    ? Other.moss
    : score >= 40 && score <= 60
    ? Brand.yellow
    : score >= 20 && score <= 40
    ? Brand.orange
    : Brand.red;
};
function ScoreCard({ score, user }) {
  const { isLightMode } = useThemeMode();
  const scoreLogo = isLightMode
    ? '/images/graphics/score_logo.svg'
    : '/images/graphics/score_logo.svg';
  const socialLevelColor = scoreToColor(score);

  return (
    <Grid item>
      {user ? (
        <CustomPaper elevation={3}>
          <Grid container direction={'column'} justifyContent={'center'}>
            <Grid container justifyContent={'space-between'}>
              <Grid item xs={10}>
                <Grid item>
                  <Typography variant="h4" noWrap sx={{ color: '#FEFEFEEE' }}>
                    {user.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <img src={scoreLogo} alt="scoreLogo" />
                </Grid>
              </Grid>
              <Grid item justifySelf={'flex-end'}>
                <CustomAvatar>
                  <img
                    src="/images/icons/twitter.svg"
                    alt="twitter"
                    width="20px"
                  />
                </CustomAvatar>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="score" sx={{ color: socialLevelColor }}>
                <CountUp end={user.score} decimals={0} start={0} duration={1} />
              </Typography>
            </Grid>
          </Grid>
        </CustomPaper>
      ) : (
        <div />
      )}
    </Grid>
  );
}

export default ScoreCard;
