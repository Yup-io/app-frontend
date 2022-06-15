import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
// import { Brand, Other } from '../../utils/colors'

const EnsText = styled(Typography)(
  ({ theme }) => `
    position: absolute;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 900;
    font-size: 150px;
    line-height: 125%;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 
  
    
    text-align: center;
    letter-spacing: 0.02em;   
    
    color: ${theme.palette.M900} ;
    
    mix-blend-mode: multiply;
    `
);
const EnsTextLight = styled(Typography)(
  ({ theme }) => `
  
  position: absolute;
        font-family: 'Gilroy';
font-style: normal;
font-weight: 900;
font-size: 150px;
line-height: 125%;
/* identical to box height, or 188px */
left: 0; 
right: 0; 
margin-left: auto; 
margin-right: auto; 
text-align: center;
letter-spacing: 0.02em;
/* Dark/Mono/900 */
color: #060506;
mix-blend-mode: luminosity;
opacity: 0.6;`
);
const CustomGrid = styled(Grid)(
  ({ theme }) => `
    background-image: url(${'/images/graphics/ens_background.svg'}); 
    background-repeat: no-repeat; 
    background-size: contain;
  `
);
const Address = styled(Typography)(
  ({ theme }) => `
  position: absolute;
    font-family: 'Geo';
    font-style: italic;
    font-weight: 500;
    font-size: 45px;
    line-height: 125%;
    /* or 56px */
    
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.16em;
    
    color: #000000;
    opacity:0.2;
    mix-blend-mode: multiply;
    `
);
const addressesToType = (num) => {
  return num >= 7
    ? 'ENS GOD'
    : num >= 5 && num <= 6
    ? 'ENS HOLDER'
    : 'ENS OWNER';
};
function EnsCard({ count, addresses, score }) {
  console.log(
    100 / (addresses.length > 8 ? 8 : addresses.length),
    score,
    count
  );
  // const addresses = [{ name: 'royalbeck.eth', score: 98 }, { name: 'royalbeck.eth', score: 60 }, { name: 'royalbeck.eth', score: 45 }, { name: 'royalbeck.eth', score: 23 }, { name: 'royalbeck.eth', score: 15 }, { name: 'royalbeck.eth', score: 70 }]
  return (
    <Grid item sx={{ width: '100%', position: 'relative' }} xs={12}>
      {addresses.slice(0, 8).map((address, index) => (
        <Grid item>
          {index % 2 === 0 ? (
            <Address
              sx={{
                top:
                  (100 / (addresses.length > 8 ? 8 : addresses.length)) *
                    index +
                  '%',
                left: Math.floor(Math.random() * 15) + '%'
              }}
            >
              {address.name}
            </Address>
          ) : (
            <Address
              sx={{
                top:
                  (100 / (addresses.length > 8 ? 8 : addresses.length)) *
                    index +
                  '%',
                right: Math.floor(Math.random() * 15) + '%'
              }}
            >
              {address.name}
            </Address>
          )}
        </Grid>
      ))}

      <CustomGrid>
        <Grid
          container
          direction="column"
          justifyContent={'center'}
          alignItems="center"
          sx={{ minHeight: '686px' }}
          spacing={5}
        >
          <Grid item xs={6}>
            <Typography variant="subtitle1">You are</Typography>
          </Grid>

          <Grid
            container
            justifyContent={'center'}
            alignItems="center"
            sx={{ position: 'relative' }}
          >
            <Grid item sx={{ height: '187px', width: '660px' }} xs={12}>
              <EnsText variant="h1" align="center" noWrap>
                {addressesToType(count)}
              </EnsText>
              <EnsTextLight variant="h1" align="center" noWrap>
                {addressesToType(count)}
              </EnsTextLight>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="s1">{`You own ${count} addresses`}</Typography>
          </Grid>
        </Grid>
      </CustomGrid>
    </Grid>
  );
}

EnsCard.propTypes = {
  score: PropTypes.number,
  count: PropTypes.number,
  addresses: PropTypes.array
};

export default EnsCard;
