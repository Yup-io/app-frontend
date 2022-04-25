import React from 'react'
import { AppBar } from '@mui/material'

import withStyles from '@mui/styles/withStyles'

const styles = theme => ({
  topBar: {
    background: 'transparent',
    boxShadow: 'none',
    borderBottom: 'none',
    [theme.breakpoints.up('lg')]: {
      padding: '16px calc((100vw - 1232px)/2)'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '16px calc((100vw - 1232px)/2)'
    },
    [theme.breakpoints.down('md')]: {
      padding: '16px calc((100vw - 994px)/2)'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px calc((100vw - 666px)/2)'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '16px calc((100vw - 552px)/2)'
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
