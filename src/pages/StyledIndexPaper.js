import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from '@mui/material'
import { withStyles } from '@mui/styles'

const styles = theme => ({
  paper: {
    backgroundImage: `linear-gradient(325deg, ${theme.palette.M900}, ${theme.palette.M900}, ${theme.palette.M900}df),
      url('images/feeds/rainbowbanner.svg')`,
    backgroundSize: 'cover',
    borderRadius: 0
  }
})

export const StyledIndexPaper = withStyles(styles)(function indexPaper ({ classes, children }) {
  return (
    <Paper className={classes.paper}>{children}</Paper>
  )
})

StyledIndexPaper.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.object.isRequired
}
