import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import withStyles from '@mui/styles/withStyles';
import PostController from './PostController'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  progress: {
    padding: theme.spacing(4),
    color: 'white'
  },
  container: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: '8%'
    }
  },
  postNotFound: {
    paddingTop: '5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.7vh',
    color: 'white'
  }
})

// TODO: Create helper function to parse any caption based on domain

function PostDisplay ({ post, classes, isLoading }) {
  if (isLoading) {
    return (
      <ErrorBoundary>
        <div align='center'>
          <CircularProgress className={classes.progress} />
        </div>
      </ErrorBoundary>
    )
  }

  if (post == null) {
    return (
      <ErrorBoundary>
        <div align='center'
          className={classes.container}
        >
          <Typography
            className={classes.postNotFound}
            constiant='h2'
          >
            The post you're looking for does not exist.
          </Typography>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div align='center'
        className={classes.container}
      >
        <PostController post={post} />
      </div>
    </ErrorBoundary>
  )
}
PostDisplay.propTypes = {
  post: PropTypes.object,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default memo(withStyles(styles)(PostDisplay))
