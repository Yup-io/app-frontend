import React from 'react'
import withStyles from '@mui/styles/withStyles'

const styles = theme => ({
  pageHeader: {
    width: '100vw',
    position: 'sticky',
    background: 'transparent',
    zIndex: 500,
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
