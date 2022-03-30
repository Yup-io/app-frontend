import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  pageBody: {
    [theme.breakpoints.up('lg')]: {
      padding: '8px 316px'
    },
    [theme.breakpoints.down('lg')]: {
      padding: '8px 316px'
    },
    [theme.breakpoints.down('md')]: {
      padding: '8px 103px'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '8px 117px'
    },
    [theme.breakpoints.down('xs')]: {
      padding: '8px 24px'
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
