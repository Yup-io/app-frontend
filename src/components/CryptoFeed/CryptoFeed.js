import React, { PureComponent } from 'react';
import Feed from '../Feed/Feed';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import axios from 'axios';
import { connect } from 'react-redux';
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll';
import FeedLoader from '../FeedLoader/FeedLoader';
import rollbar from '../../utils/rollbar';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { apiBaseUrl } from '../../config';

const styles = (theme) => ({
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    minHeight: '800px',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      maxWidth: '85vw'
    }
  },
  scrollDiv: {
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
  infiniteScroll: {
    display: 'inherit',
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block'
    }
  }
});

class CryptoFeed extends PureComponent {
  state = {
    posts: [],
    initialLoad: true,
    hasMore: true,
    start: 0
  };

  componentDidMount() {
    this.fetchCryptoPosts();
  }

  fetchCryptoPosts = async () => {
    try {
      const fetchLim = 15;
      const posts = (
        await axios.get(
          `${apiBaseUrl}/feed/crypto/?start=${this.state.start}&limit=${fetchLim}`
        )
      ).data;
      this.setState({
        hasMore: true,
        initialLoad: false,
        posts: this.state.posts.concat(posts),
        start: this.state.start + fetchLim + 1
      });
    } catch (err) {
      this.setState({
        hasMore: false,
        initialLoad: false
      });
      rollbar.error(
        `WEBAPP: Failed to load Crypto feed error=${JSON.stringify(err)}`
      );
      console.error('Failed to fetch recent posts', err);
    }
  };

  render() {
    const { classes } = this.props;
    const { posts, initialLoad, hasMore } = this.state;

    return (
      <ErrorBoundary>
        <div className={classes.scrollDiv}>
          <InfiniteScroll
            dataLength={posts.length}
            hasMore={hasMore}
            height="100vh"
            className={classes.infiniteScroll}
            loader={
              !initialLoad ? (
                <div className={classes.feedLoader}>
                  <FeedLoader />
                </div>
              ) : (
                ''
              )
            }
            next={this.fetchCryptoPosts}
            onScroll={this.onScroll}
          >
            <Feed isLoading={initialLoad} posts={posts} hasMore={hasMore} />
          </InfiniteScroll>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    account: state.scatterRequest.account,
    push: state.scatterInstallation.push
  };
};

CryptoFeed.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(CryptoFeed));
