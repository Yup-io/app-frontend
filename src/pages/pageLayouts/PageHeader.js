import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  pageHeader: {
    top: 0,
    zIndex: 500,
    width: '100vw',
    position: 'sticky',
    backgroundColor: theme.palette.M850,
    [theme.breakpoints.up('lg')]: {
      padding: '80px 316px 12px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '80px 316px 12px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '80px 103px 12px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '80px 117px 12px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '80px 24px 12px'
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
