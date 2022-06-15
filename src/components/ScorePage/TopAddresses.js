import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Brand, Other } from '../../utils/colors';

const CustomPaper = styled(Paper)(
  ({ theme }) => `
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
    background-color: ${theme.palette.M900};
    border-radius: 18px;
    width: 731px;
    padding: ${theme.spacing(6)};
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
function TopAddresses({ addresses }) {
  // const addresses = [{ name: 'royalbeck.eth', score: 98 }, { name: 'royalbeck.eth', score: 60 }, { name: 'royalbeck.eth', score: 45 }, { name: 'royalbeck.eth', score: 23 }, { name: 'royalbeck.eth', score: 15 }, { name: 'royalbeck.eth', score: 70 }]
  return (
    <Grid item>
      <CustomPaper>
        <Grid container justifyContent={'center'} spacing={5}>
          <Grid item>
            <Typography variant="h3">Top Interacted addresses</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              {addresses.map((address) => {
                return (
                  <Grid item xs={6}>
                    <Grid
                      container
                      justifyContent={'center'}
                      alignItems={'center'}
                      spacing={2}
                    >
                      <Grid item xs={8}>
                        <Typography variant="h5" noWrap>
                          {address.name}
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Typography
                          variant="h3"
                          color={scoreToColor(address.score)}
                        >
                          {address.score}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </CustomPaper>
    </Grid>
  );
}

TopAddresses.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.Object).isRequired
};

export default TopAddresses;
