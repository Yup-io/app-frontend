import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Grid from '@mui/material/Grid'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  root: {
    padding: 0,
    height: '70px',
    cursor: 'pointer',
    position: 'sticky',
    alignContent: 'center',
    maxWidth: '350px',
    fontSize: '12px',
    width: '100%',
    opacity: '0.8'
  },
  container: {
    height: '100%'
  },
  imgWrapper: {
    display: 'inline-block',
    height: '100%',
    position: 'absolute',
    zIndex: '-1',
    maxWidth: '60px'
  },
  textContainer: {
    display: 'inline-block',
    height: '100%',
    maxWidth: '100%',
    paddingLeft: '60px',
    width: '100%'
  },
  notifGrad: {
    position: 'absolute',
    background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(43, 43, 43) 100%)',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0
  }
})

function NotifOutline ({ classes }) {
  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <Grid className={classes.container}
          container
          spacing={0}
        >
          <div className={classes.imgWrapper}>
            <div className={classes.notifGrad} />
          </div>
          <Grid className={classes.textContainer}
            item
          />
        </Grid>
      </div>
    </ErrorBoundary>
  )
}

NotifOutline.propTypes = {
  classes: PropTypes.object.isRequired
}

export default (withStyles(styles)(NotifOutline))
