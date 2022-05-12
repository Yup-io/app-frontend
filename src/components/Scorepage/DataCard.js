import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { connect } from 'react-redux'

const CustomPaper = styled(Paper)(
  ({ theme }) => `
  left: calc(50% - 515px/2 - 358px);
  top: 0px;
  padding: 32px 48px;  
  max-width: 515px;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
  
  border-radius: 16px;
  `)

const TitleTextGradient = styled(Typography)(
  ({ theme }) => `
    background: linear-gradient(270deg, #00E08E 0%, #A2CF7E 31.56%, #FCA016 66.46%, #EB3650 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    `)
function ScoreCard ({ title, subtitle, desc, lightMode, noGradient }) {
  console.log(subtitle, desc, lightMode)
  // const addresses = [{ name: 'royalbeck.eth', score: 98 }, { name: 'royalbeck.eth', score: 60 }, { name: 'royalbeck.eth', score: 45 }, { name: 'royalbeck.eth', score: 23 }, { name: 'royalbeck.eth', score: 15 }, { name: 'royalbeck.eth', score: 70 }]
  return (
    <Grid item>
      <CustomPaper elevation={3}>
        <Grid container
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={3}>
          <Grid item
            xs={12}>
            {!noGradient ? (
              <TitleTextGradient variant='h6'
                align='center'

              >{title}
              </TitleTextGradient>) : (
              <Typography variant='subtitle1'
                align='center'

              >{title}
              </Typography>)}
          </Grid>
          <Grid item
            xs={12}>

            <Typography variant='h3'
              align='center'
              sx={{ color: (theme) => theme.palette.M50 }}
            >{subtitle}
            </Typography>
          </Grid>
          <Grid item
            xs={12}>

            <Typography variant='subtitle1'
              align='center'
              sx={{ color: (theme) => theme.palette.M50 }}
            >{desc}
            </Typography>
          </Grid>
        </Grid>
      </CustomPaper>
    </Grid>
  )
}

const mapStateToProps = (state) => {
  return {
    lightMode: state.lightMode.active
  }
}
ScoreCard.propTypes = {
  lightMode: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  desc: PropTypes.string,
  noGradient: PropTypes.bool
}

export default connect(mapStateToProps)(ScoreCard)
