import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  pageHeader: {
    width: '100vw',
    position: 'sticky',
    top: 0,
    background: `linear-gradient(${theme.palette.M900} 100%, ${theme.palette.M900}dd 10%)`,
    borderRadius: '5px',
    zIndex: 500,
    [theme.breakpoints.up('lg')]: {
      padding: '24px calc((100vw - 1232px)/2) 0'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '24px calc((100vw - 1232px)/2) 0'
    },
    [theme.breakpoints.down('md')]: {
      padding: '24px calc((100vw - 994px)/2) 0'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '24px calc((100vw - 666px)/2) 0'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '24px calc((100vw - 552px)/2) 0'
    }
  }
})

const PageHeader = withStyles(styles)(function PageHeader ({
  classes, children, ...restProps
}) {
  return (
    <div
      className={classes.pageHeader}
      {...restProps}
    >
      {children}
    </div>
  )
})

export default PageHeader
