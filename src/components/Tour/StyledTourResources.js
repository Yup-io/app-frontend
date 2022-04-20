import React from 'react'
import YupButton from '../Miscellaneous/YupButton'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  tourResources: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginBottom: '1em'
  }
})

const StyledTourResources = withStyles(styles)(function TourResources ({
  classes
}) {
  return (
    <div className={classes.tourResources}>
      <YupButton
        size='small'
        color='primary'
        variant='contained'
        href='https://docs.yup.io'
        target='_blank'
      >Docs</YupButton>
      <YupButton
        size='small'
        color='primary'
        variant='contained'
        href='https://yup.io'
        target='_blank'
      >Website</YupButton>
      <YupButton
        size='small'
        color='primary'
        variant='contained'
        href='https://blog.yup.io'
        target='_blank'
      >Blog</YupButton>
    </div>
  )
})

export default StyledTourResources
