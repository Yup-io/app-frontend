import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import FeedLoader from '../FeedLoader/FeedLoader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchFeed } from '../../redux/actions';

import PostController from '../Post/PostController';
import { Typography } from '@mui/material';

import useStyles from './FeedHOCStyles';
import { logPageView } from '../../utils/analytics';

const FeedHOC = ({ feedType }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const feedInfo = useSelector((state) => state.feedInfo?.feeds[feedType]);

  // Fetches initial posts, if there are none
  const fetchPosts = () => {
    if (!feedInfo) {
      return;
    }

    const { posts, limit } = feedInfo;

    if (posts.length < limit) {
      dispatch(fetchFeed(feedType, 0, limit));
    }
  };

  // Increases start value, to fetch next posts
  const fetchPostsScroll = () => {
    const { start, limit } = feedInfo;

    dispatch(fetchFeed(feedType, start, limit));
  };

  useEffect(() => {
    fetchPosts();
    logPageView(feedType);
  }, [feedType]);

  const { posts = [], hasMore = false } = feedInfo || {};

  if (!hasMore && posts.length === 0) {
    return (
      <div align="center">
        <Typography variant="caption" className={classes.noPostsText}>
          No posts found
        </Typography>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={classes.scrollDiv}>
        <InfiniteScroll
          dataLength={posts.length}
          hasMore={hasMore}
          height="calc(100vh - 220px)"
          className={classes.infiniteScroll}
          loader={
            <div className={classes.feedLoader}>
              <FeedLoader />
            </div>
          }
          next={fetchPostsScroll}
        >
          <div
            className={classes.container}
            style={{ marginBottom: !hasMore ? '10%' : '' }}
          >
            <div
              id="profilefeed"
              align="center"
              className={classes.page}
              tourname="ProfileFeed"
            >
              {posts.map((post) => (
                <PostController
                  key={post._id.postid}
                  post={post}
                  renderObjects
                />
              ))}
            </div>
            {!hasMore && <p className={classes.resetScroll}>end of feed</p>}
          </div>
        </InfiniteScroll>
      </div>
    </ErrorBoundary>
  );
};

export default FeedHOC;
