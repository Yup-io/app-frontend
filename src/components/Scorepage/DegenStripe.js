import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { connect } from 'react-redux'
import { Brand, Other } from '../../utils/colors'
import { styled } from '@mui/system'

const Stripe = styled(Grid)(
  ({ theme }) => `
    background: #060506;
    transform: rotate(-3.63deg)
      `)
const scoreToColor = (score) => {
  return score >= 80 && score <= 100 ? Brand.mint : score >= 60 && score <= 80 ? Other.moss : score >= 40 && score <= 60 ? Brand.yellow : score >= 20 && score <= 40 ? Brand.orange : Brand.red
}
function DegenStripe ({ score, lightMode }) {
  const socialLevelColor = scoreToColor(score)
  console.log(socialLevelColor, lightMode)
  return (
    <Stripe item >
      <Typography variant='h1'>
        ATTENTION DEGEN AHEAD!!! | ATTENTION DEGEN AHEAD!!! |  ATTENTION DEGEN AHEAD!!! |
      </Typography>
    </Stripe>
  )
}

const mapStateToProps = (state) => {
  return {
    lightMode: state.lightMode.active
  }
}
DegenStripe.propTypes = {
  lightMode: PropTypes.bool,
  score: PropTypes.number
}

export default connect(mapStateToProps)(DegenStripe)
