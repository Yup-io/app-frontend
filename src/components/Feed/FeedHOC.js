import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import { connect } from 'react-redux'
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll'
import FeedLoader from '../FeedLoader/FeedLoader'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { fetchFeed } from '../../redux/actions'
import { createSelector } from 'reselect'

import PostController from '../Post/PostController'
import { Typography } from '@mui/material'

const styles = theme => ({
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    minHeight: '800px',
    margin: '0 auto',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '600px'
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '85vw',
      marginleft: 0
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '98vw',
      margin: '0 0'
    }
  },
  scrollDiv: {
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
  infiniteScroll: {
    display: 'inherit',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block'
    }
  },
  container: {
    width: '100vw'
  },
  page: {
    overflowY: 'none',
    marginBottom: '0%',
    maxWidth: '625px',
    width: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '600px'
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: '0%'
    }
  },
  resetScroll: {
    fontFamily: 'Gilroy',
    color: theme.palette.M50,
    textAlign: 'center',
    textDecoration: 'none',
    fontWeight: '300'
  },
  noPostsText: {
    color: theme.palette.M50
  }
})

class FeedHOC extends PureComponent {
  static whyDidYouRender = true

  logPageView (feed) {
    if (!window.analytics) {
      return
    }

    switch (feed) {
    case 'dailyhits':
      window.analytics.page('Daily Hits')
      break
    case 'lol':
      window.analytics.page('Funny')
      break
    case 'brainfood':
      window.analytics.page('Smart')
      break
    case 'latenightcool':
      window.analytics.page('Late Night Cool')
      break
    case 'politics':
      window.analytics.page('The Race')
      break
    case 'non-corona':
      window.analytics.page('Safe Space')
      break
    case 'crypto':
      window.analytics.page('Crypto')
      break
    case 'mirror':
      window.analytics.page('Mirror')
      break
    case 'nfts':
      window.analytics.page('NFTs')
      break
    case 'new':
      window.analytics.page('New')
      break
    }
  }

  componentDidMount () {
    this.fetchPosts()
    this.logPageView()
  }

  componentDidUpdate (prevProps) {
    if (this.props.feed !== prevProps.feed) {
      this.fetchPosts()
      this.logPageView()
    }
  }

  // Fetches initial posts, if there are none
  fetchPosts = () => {
    const { dispatch, feed, feedInfo } = this.props
    if (feedInfo && feedInfo[feed]) {
      if (feedInfo[feed].posts.length < feedInfo[feed].limit) {
        dispatch(fetchFeed(feed, 0, feedInfo[feed].limit))
      }
    }
  }

  // Increases start value, to fetch next posts
  fetchPostsScroll = () => {
    const { dispatch, feed, feedInfo } = this.props
    dispatch(fetchFeed(feed, feedInfo[feed].start, feedInfo[feed].limit))
  }
  render () {
    const { posts, classes, hasMore } = this.props

    if (!hasMore && posts.length === 0) {
      return (
        <div align='center'>
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
        <div className={classes.scrollDiv}>
          <InfiniteScroll
            dataLength={posts.length}
            hasMore={hasMore}
            height={hasMore ? '100vh' : '90vh'}
            className={classes.infiniteScroll}
            loader={<div className={classes.feedLoader}>
              <FeedLoader />
            </div>}
            next={this.fetchPostsScroll}
            onScroll={this.onScroll}
          >
            <div className={classes.container}
              style={{ marginBottom: !hasMore ? '10%' : '' }}
            >
              <div id='profilefeed'
                align='center'
                className={classes.page}
                tourname='ProfileFeed'
              >
                {
                  posts.map((post) => (
                    <PostController key={post._id.postid}
                      post={post}
                      renderObjects
                    />
                  ))
                }
              </div>
              {!hasMore &&
              <p className={classes.resetScroll}>end of feed</p>
              }
            </div>
          </InfiniteScroll>
        </div>
      </ErrorBoundary>
    )
  }
}

const getActiveFeedType = (state) => {
  return state.router.location.query.feed || state.homeFeed.homeFeed
}

const getAllFeeds = (state) => {
  return state.feedInfo && state.feedInfo.feeds
}

export const getFeedPosts = createSelector(
  [getActiveFeedType, getAllFeeds],
  (activeFeedType, allFeeds) => {
    const feedInfo = allFeeds[activeFeedType]
    if (feedInfo) {
      return feedInfo.posts
    }
    return []
  }
)

const mapStateToProps = (state) => {
  const feedType = getActiveFeedType(state)
  return {
    posts: getFeedPosts(state),
    feedInfo: state.feedInfo.feeds,
    hasMore: state.feedInfo.feeds[feedType].hasMore
  }
}

FeedHOC.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  feed: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  feedInfo: PropTypes.object.isRequired,
  hasMore: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(FeedHOC))
