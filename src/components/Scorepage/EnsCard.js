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
const addressesToType = (num) => {
  return num >= 7 ? 'ENS GOD' : num >= 5 && num <= 6 ? 'ENS HOLDER' : 'ENS OWNER'
}
function EnsCard ({ addresses }) {
  console.log(addresses)
  // const addresses = [{ name: 'royalbeck.eth', score: 98 }, { name: 'royalbeck.eth', score: 60 }, { name: 'royalbeck.eth', score: 45 }, { name: 'royalbeck.eth', score: 23 }, { name: 'royalbeck.eth', score: 15 }, { name: 'royalbeck.eth', score: 70 }]
  return (
    <Grid item
      sx={{ width: '100%', position: 'relative' }}
      xs={12}>
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
              >{addressesToType(addresses?.domains?.length)}
              </EnsText>
              <EnsTextLight variant='h1'
                noWrap>
                {addressesToType(addresses?.domains?.length)}
              </EnsTextLight>
            </Grid>
          </Grid>
          <Grid item
            xs={6}>
            <Typography variant='s1'
            >{`You own ${2} addresses`}
            </Typography>
          </Grid>
        </Grid>
      </CustomGrid>
    </Grid>
  )
}

EnsCard.propTypes = {
  addresses: PropTypes.array
}

export default EnsCard
