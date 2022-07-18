import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { connect } from 'react-redux';
import { scoreToColor, scoreToColorText } from './helpers';

const ColorTextBackground = styled(Typography)(
    ({ theme, colorText }) => `
      background-image: url(${`/images/graphics/${colorText}_vector.svg`}); 
      background-repeat: no-repeat; 
    `
  );
function ColorText({ score }) {
    const colorText = scoreToColorText(score);
  return (
    
    <Grid item xs={12}>
    <Grid container justifyContent="center">
      <Grid item xs={10} md={8} lg={7}>
        <Typography variant="subtitle1" align="center">
          There are alot of ways your yup score is being calculated here
          are a few more reasons why you are so
          <ColorTextBackground variant="h5" display="inline">
            {colorText}
          </ColorTextBackground>
        </Typography>
      </Grid>
    </Grid>
  </Grid>
  );
}

export default ColorText;
