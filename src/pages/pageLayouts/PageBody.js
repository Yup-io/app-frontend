import React from 'react'
import withStyles from '@mui/styles/withStyles'

const styles = theme => ({
  pageBody: {
    height: '100vh',
    overflowY: 'scroll',
    [theme.breakpoints.up('xl')]: {
      padding: '0 calc((100vw - 1144px)/2)'
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0 calc((100vw - 1048px)/2)'
    },
    [theme.breakpoints.down('xl')]: {
      padding: '0 160px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '0 140px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '0 calc((100vw - 552px)/2)'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px'
    }
  }
})

const PageBody = withStyles(styles)(function PageBody ({
  classes, pageClass, children, ...restProps
}) {
  return (
    <div
      className={`${classes.pageBody} ${pageClass}`}
      {...restProps}
    >
      {children}
    </div>
  )
})

export default PageBody
