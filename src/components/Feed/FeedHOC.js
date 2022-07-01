import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import FeedLoader from '../FeedLoader/FeedLoader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchFeed } from '../../redux/actions';

import PostController from '../Post/PostController';
import { Typography } from '@mui/material';

import useStyles from './FeedHOCStyles';
import { logPageView } from '../../utils/analytics';
import clsx from 'clsx'

const FeedHOC = ({ feedType, setIsMinimize, isMinimize }) => {
  const classes = useStyles();
  const scrollRef = useRef(0);
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

    // If start is zero, fetchPosts is called. Temporary solution.
    if (!start) {
      return;
    }

    dispatch(fetchFeed(feedType, start, limit));
  };

  useEffect(() => {
    const element = document.querySelector('.infinite-scroll-component');

    if (element) {
      element.scrollTop = 0;
    }

    fetchPosts();
    logPageView(feedType);
  }, [feedType]);

  const handleScroll = (e) => {
    let element = e.target;
    if (element.scrollTop > scrollRef.current && !isMinimize) {
      setIsMinimize(true);
    }
    if (element.scrollTop === 0 && isMinimize) {
      setIsMinimize(false);
    }

    scrollRef.current = element.scrollTop;
  };
  const { posts = [], hasMore = false } = feedInfo || {};

  if (!hasMore && posts.length === 0) {
    return (
      <div align="center">
        <Typography variant="url" className={classes.noPostsText}>
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
          height={`calc(100vh - ${isMinimize ? 130 : 150}px)`}
          className={clsx(classes.infiniteScroll, 'infinite-scroll-component')}
          loader={
            <div className={classes.feedLoader}>
              <FeedLoader />
            </div>
          }
          onScroll={handleScroll}
          next={fetchPostsScroll}
          endMessage={<p className={classes.resetScroll}>end of feed</p>}
        >
          <div
            className={classes.container}
          >
            <div
              id="profilefeed"
              align="center"
              className={classes.page}
            >
              {posts.map((post) => (
                <PostController
                  key={post._id.postid}
                  post={post}
                  renderObjects
                />
              ))}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </ErrorBoundary>
  );
};

export default FeedHOC;
