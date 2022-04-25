import React from 'react'
import withStyles from '@mui/styles/withStyles'

const styles = theme => ({
  pageBody: {
    [theme.breakpoints.up('lg')]: {
      padding: '0 calc((100vw - 1232px)/2)'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '0 calc((100vw - 1232px)/2)'
    },
    [theme.breakpoints.down('md')]: {
      padding: '0 calc((100vw - 994px)/2)'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 calc((100vw - 666px)/2)'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0 calc((100vw - 552px)/2)'
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
