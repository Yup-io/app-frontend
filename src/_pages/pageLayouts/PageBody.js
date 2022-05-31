import React from 'react'
import withStyles from '@mui/styles/withStyles'
import { Grid } from '@mui/material'
import clsx from 'clsx'

const styles = theme => ({
  pageBody: {
    overflow: 'auto',
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
  },
  scrollable: {
    height: 'unset'
  }
})

const PageBody = withStyles(styles)(function PageBody ({
  classes, pageClass, children, scrollable, ...restProps
}) {
  return (
    <Grid
      className={clsx(classes.pageBody, pageClass, scrollable && classes.scrollable)}
      {...restProps}
    >
      {children}
    </Grid>
  )
})

export default PageBody
