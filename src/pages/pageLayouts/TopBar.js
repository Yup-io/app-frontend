import React from 'react'
import { withStyles, AppBar } from '@material-ui/core'

const styles = theme => ({
  topBar: {
    background: 'transparent',
    boxShadow: 'none',
    borderBottom: 'none',
    [theme.breakpoints.up('lg')]: {
      padding: '16px 316px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '16px 316px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '16px 103px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '16px 117px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '16px 24px'
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
