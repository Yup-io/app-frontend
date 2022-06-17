import { Grid } from '@mui/material';
import YupListsMenu from './YupListsMenu';
import ListLoader from '../FeedLoader/ListLoader';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import YupListFeed from './YupListFeed';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import React, { useEffect, useRef, useState } from 'react';
import useStyles from './YupListStyles';
import useYupListSettings from '../../hooks/useYupListSettings';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import capitalize from 'lodash/capitalize';
import { apiBaseUrl } from '../../config';
import rollbar from '../../utils/rollbar';
import { updateSearchListPosts } from '../../redux/actions';
import { logPageView } from '../../utils/analytics';

const YupList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const settings = useYupListSettings();
  const searchInfo = useSelector((state) => state.updateSearchListPosts);

  const catName = settings.category.name;
  const subjName = settings.subject.name;
  const siteName = settings.site.name;
  const isLoadingSettings = !siteName && !subjName && !catName;

  const postType = `${siteName}:${subjName}`;

  const [isMinimize, setIsMinimize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(0);
  const handleLogPageView = () => {
    const { category, subject, site, preposition } = settings;

    const catTitleText = category.altName || capitalize(category.displayName);
    const subjTitleText = subject.altName || capitalize(subject.displayName);
    const siteTitleText = preposition
      ? `${preposition} ${site.altName || capitalize(site.displayName)}`
      : '';
    const listTitle =
      catTitleText.length > 0 && subjTitleText.length > 0
        ? `${catTitleText} ${subjTitleText} ${siteTitleText}`
        : '';

    logPageView(listTitle);
  };

  const fetchYupListPosts = async (reset) => {
    try {
      const { start: _start, posts: _posts } = searchInfo;

      // TODO: Find better way to reset start to 0 when changing subjects/categories/sites
      const start = reset ? 0 : _start;
      const posts = reset ? [] : _posts;

      const listType = `${siteName}:${subjName}`;

      const newPosts = (
        await axios.get(`${apiBaseUrl}/v1/lists`, {
          params: {
            start,
            limit: 20,
            category: catName,
            subject: 'posts',
            list: listType,
            order: 1
          }
        })
      ).data;

      const filteredPosts = newPosts.filter(
        (post) => !!(post.previewData && post.previewData.title)
      );

      dispatch(
        updateSearchListPosts({
          hasMore: !!newPosts.length,
          initialLoad: false,
          posts: posts.concat(filteredPosts),
          listType: listType,
          start: start + 20 + 1
        })
      );

      setIsLoading(false);
    } catch (err) {
      dispatch(
        updateSearchListPosts({
          hasMore: false,
          initialLoad: false
        })
      );
      rollbar.error(
        `WEBAPP: Failed to load Yup list error=${err} settings=${JSON.stringify(
          settings
        )}`
      );
      console.error('Failed to fetch Yup list', err);
    }
  };

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

  useEffect(() => {
    dispatch(
      updateSearchListPosts({
        start: 0,
        initialLoad: true,
        hasMore: true,
        posts: [],
        isSearch: false
      })
    );
    handleLogPageView();
    fetchYupListPosts(true);
  }, [catName, siteName, subjName]);

  const { posts, initialLoad, hasMore } = searchInfo;

  return (
    <ErrorBoundary>
      <Grid
        container
        alignItems="center"
        direction="column"
        justifycontent="flex-start"
        style={{ width: '100%' }}
      >
        <Grid item style={{ width: '100%' }}>
          <div className={classes.root}>
            <YupListsMenu isMinimize={isMinimize} />
          </div>
        </Grid>
        {isLoadingSettings ? (
          <div className={classes.feedLoader}>
            <ListLoader />
          </div>
        ) : (
          <Grid item style={{ width: '100%' }}>
            <div className={classes.scrollDiv} tourname="ListsFeed">
              {isLoading ? (
                <div className={classes.listLoader}>
                  <ListLoader />
                </div>
              ) : (
                <InfiniteScroll
                  dataLength={posts.length}
                  hasMore={hasMore}
                  height="100vh"
                  scrollThreshold={0.8}
                  onScroll={handleScroll}
                  next={fetchYupListPosts}
                  className={classes.infiniteScroll}
                  loader={
                    <div className={classes.listLoader}>
                      <ListLoader />
                    </div>
                  }
                >
                  <YupListFeed
                    isLoading={initialLoad}
                    posts={posts}
                    category={catName}
                    postType={postType}
                    isSearch={searchInfo.isSearch}
                  />
                </InfiniteScroll>
              )}
            </div>
          </Grid>
        )}
      </Grid>
    </ErrorBoundary>
  );
};

export default YupList;
