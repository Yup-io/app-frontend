import React from 'react'
import { AppBar } from '@mui/material'

import withStyles from '@mui/styles/withStyles'

const styles = theme => ({
  topBar: {
    background: 'transparent',
    boxShadow: 'none',
    borderBottom: 'none',
    [theme.breakpoints.up('xl')]: {
      padding: '0 calc((100vw - 1144px)/2)'
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0 calc((100vw - 1048px)/2)'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '0 160px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '0 140px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 calc((100vw - 552px)/2)'
    }
  }
})

const TopBar = withStyles(styles)(function TopBar ({
  classes, children, props, ...restProps
}) {
  return (
    <AppBar
      position='fixed'
      className={classes.topBar}
      {...restProps}
    >
      {children}
    </AppBar>
  )
})

export default TopBar
