import React, { memo } from 'react'
import PostController from '../Post/PostController'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import { Typography } from '@mui/material'
import FeedLoader from '../FeedLoader/FeedLoader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  feedContainer: {
    [theme.breakpoints.down('lg')]: {
      width: '100%'
    },
    [theme.breakpoints.up('1700')]: {
      width: '100%'
    }
  },
  feedPage: {
    overflowY: 'none',
    margin: 'auto',
    marginBottom: '0%',
    maxWidth: '625px',
    width: '100%',
    [theme.breakpoints.down('xl')]: {
      maxWidth: '600px'
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '0%'
    }
  },
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    margin: '0 auto',
    minHeight: '800px',
    [theme.breakpoints.down('xl')]: {
      maxWidth: '600px'
    },
    [theme.breakpoints.down('lg')]: {
      maxWidth: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '98vw',
      margin: '0 0'
    }
  },
  resetScroll: {
    fontFamily: 'Gilroy',
    color: theme.palette.M50,
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: '300',
    maxWidth: 600
  },
  noPostsText: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.M50
  }
})

function Feed (props) {
  const { posts, classes, isLoading, hasMore, hideInteractions, renderObjects } = props
  // remove duplicate posts
  const formatPosts = Array.from(new Set(posts))

  if (isLoading) {
    return (
      <div className={classes.feedLoader}>
        <FeedLoader />
      </div>
    )
  }

  if (!isLoading && !hasMore && posts.length === 0) {
    return (
      <div className={classes.feedPage}>
        <Typography
          variant='caption'
          className={classes.noPostsText}
        >
          No posts found
        </Typography>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={classes.feedContainer}
        style={{ marginBottom: !hasMore ? '10%' : '' }}
      >
        <div id='profilefeed'
          align='center'
          className={classes.feedPage}
          tourname='ProfileFeed'
        >
          {
            formatPosts.map((post, index) => (
              <PostController key={index}
                renderObjects={renderObjects}
                post={post}
                hideInteractions={hideInteractions}
                classes={classes}
              />
            ))
          }
        </div>
        {!isLoading && !hasMore &&
          <p className={classes.resetScroll}>End</p>
        }
      </div>
    </ErrorBoundary>
  )
}

Feed.propTypes = {
  posts: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  hideInteractions: PropTypes.bool,
  renderObjects: PropTypes.bool
}

export default memo(withStyles(styles)(Feed))
