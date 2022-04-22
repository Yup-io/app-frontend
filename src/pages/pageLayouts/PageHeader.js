import React from 'react'
import withStyles from '@mui/styles/withStyles';

const styles = theme => ({
  pageHeader: {
    top: 60,
    width: '100vw',
    position: 'sticky',
    boxShadow: `0px -60px 0px ${theme.palette.M900}`,
    background: `linear-gradient(${theme.palette.M900} 100%, ${theme.palette.M900}dd 10%)`,
    borderRadius: 5,
    zIndex: 500,
    [theme.breakpoints.up('lg')]: {
      padding: '24px calc((100vw - 1232px)/2) 6px'
    },
    [theme.breakpoints.down('xl')]: {
      padding: '24px calc((100vw - 1232px)/2) 6px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '24px calc((100vw - 994px)/2) 6px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '24px calc((100vw - 666px)/2) 6px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '24px calc((100vw - 552px)/2) 6px'
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
