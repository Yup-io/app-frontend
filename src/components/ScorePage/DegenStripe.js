import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { styled } from '@mui/system';
import { scoreToColor } from './helpers';

const Stripe = styled(Grid)(
  ({ theme }) => `
    background: #060506;
    height: 110px;
    transform: rotate(-3.63deg);
    overflow: hidden;
    margin-left: -10px;
      `
);
const Stripe2 = styled(Grid)(
  ({ theme }) => `
          background: #060506;
          height: 89px;
          filter: blur(5px);
          transform: rotate(4.95deg);
          overflow: hidden;
          margin-left: -10px;
            `
);
function DegenStripe({ score, lightMode }) {
  const socialLevelColor = scoreToColor(score);
  return (
    <Grid container sx={{ paddingTop: '24px', overflow: 'hidden' }}>
      <Grid item sx={{ zIndex: 1 }}>
        <Stripe container alignItems="center">
          <Typography
            variant="h1"
            // p={1}
            color={socialLevelColor}
            sx={{ textOverflow: 'unset' }}
            noWrap
          >
            ATTENTION DEGEN AHEAD!!! | ATTENTION DEGEN AHEAD!!! | ATTENTION
            DEGEN AHEAD!!! |
          </Typography>
        </Stripe>
      </Grid>

      <Grid item>
        <Stripe2 container alignItems="center">
          <Typography
            variant="h2"
            color={socialLevelColor}
            sx={{ textOverflow: 'unset' }}
            noWrap
          >
            ATTENTION DEGEN AHEAD!!! | ATTENTION DEGEN AHEAD!!! | ATTENTION
            DEGEN AHEAD!!! |
          </Typography>
        </Stripe2>
      </Grid>
    </Grid>
  );
}

export default DegenStripe;
