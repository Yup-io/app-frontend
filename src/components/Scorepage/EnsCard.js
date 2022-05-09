import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
// import { Brand, Other } from '../../utils/colors'

const EnsText = styled(Typography)(
  ({ theme }) => `
    position: absolute;
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 900;
    font-size: 150px;
    line-height: 125%;
    
    text-align: center;
    letter-spacing: 0.02em;   
    
    color: ${theme.palette.M900}
    
    mix-blend-mode: overlay;
    `)
const EnsTextLight = styled(Typography)(
  ({ theme }) => `
  
  position: absolute;
        font-family: 'Gilroy';
font-style: normal;
font-weight: 900;
font-size: 150px;
line-height: 125%;
/* identical to box height, or 188px */

text-align: center;
letter-spacing: 0.02em;

/* Dark/Mono/900 */

color: #060506;

mix-blend-mode: luminosity;
opacity: 0.1;`
)
const BackgroundGradient = styled(Grid)(
  ({ theme }) => `
  position: absolute;
    background: linear-gradient(258.34deg, rgba(0, 224, 142, 0.4) 10.55%, rgba(162, 207, 126, 0.4) 35.34%, rgba(252, 160, 22, 0.4) 62.49%, rgba(235, 54, 80, 0.4) 80.85%);
    filter: blur(300px);
    transform: rotate(3.66deg);
    `
)
const CustomGrid = styled(Grid)(
  ({ theme }) => `
    background-image: url(${'/images/graphics/ens_background.svg'}); 
    background-repeat: no-repeat; 
    background-size: cover;
  `)
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
    
    mix-blend-mode: overlay;
    `)
const addressesToType = (num) => {
  return num >= 7 ? 'ENS GOD' : num >= 5 && num <= 6 ? 'ENS HOLDER' : 'ENS OWNER'
}
function EnsCard ({ count, addresses, score }) {
  console.log(addresses, score, count)
  // const addresses = [{ name: 'royalbeck.eth', score: 98 }, { name: 'royalbeck.eth', score: 60 }, { name: 'royalbeck.eth', score: 45 }, { name: 'royalbeck.eth', score: 23 }, { name: 'royalbeck.eth', score: 15 }, { name: 'royalbeck.eth', score: 70 }]
  return (
    <Grid item
      sx={{ width: '100%', position: 'relative' }}
      xs={12}>
      {addresses.slice(0, 8).map((address, index) => (
        <div >
          {index % 2 === 0 ? (
            <Address sx={{ top: 15 * index + '%', left: 15 * index + '%' }}>{address.name}</Address>) : (
            <Address sx={{ top: 15 * index + '%', right: 15 * index + '%' }}>{address.name}</Address>)
          }</div>
      ))}

      <BackgroundGradient />
      <CustomGrid>
        <Grid container
          direction='column'
          justifyContent={'center'}
          alignItems='center'
          spacing={5}>
          <Grid item
            xs={6}>
            <Typography variant='subtitle1'
            >You are
            </Typography>
          </Grid>

          <Grid container
            justifyContent={'center'}
            alignItems='center'
            sx={{ position: 'relative' }}>

            <Grid item
              sx={{ height: '187px', width: '660px' }}
              xs={6}>
              <EnsText variant='h1'
                noWrap
              >{addressesToType(count)}
              </EnsText>
              <EnsTextLight variant='h1'
                noWrap>
                {addressesToType(count)}
              </EnsTextLight>
            </Grid>
          </Grid>
          <Grid item
            xs={6}>
            <Typography variant='s1'
            >{`You own ${count} addresses`}
            </Typography>
          </Grid>
        </Grid>
      </CustomGrid>
    </Grid>
  )
}

EnsCard.propTypes = {
  score: PropTypes.number,
  count: PropTypes.number,
  addresses: PropTypes.array
}

export default EnsCard
