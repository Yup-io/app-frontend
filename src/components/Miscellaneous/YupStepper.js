
import { StepLabel, Stepper, Step, Typography, Grid } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/styles'

const YupStepper = ({ steps, activeStep }) => {
  const theme = useTheme()

  const isActive = (step) => step === steps[activeStep]

  return (
    <Stepper
      activeStep={activeStep}
      style={{ backgroundColor: theme.palette.alt.second, width: '50%' }}
    >
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>
            {isActive(label) && (
              <img
                src='/images/graphics/step_border.svg'
                alt='rainbow border'
                style={{ marginRight: 10 }}
              />
            )}
            <Grid container
              direction='column'
              style={{ marginTop: 2 }}
            >
              <Typography variant='body2'>Step {index + 1}</Typography>
              <Typography variant='h4'>{label}</Typography>
            </Grid>
          </StepLabel>
        </Step>
      ))}
    </Stepper>)
}

YupStepper.propTypes = {
  steps: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired
}

export default YupStepper
