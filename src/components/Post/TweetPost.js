import React, { PureComponent } from 'react';
import CustomTweetEmbed from '../CustomTweetEmbed/CustomTweetEmbed';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './tweet.module.css';

const styles = (theme) => ({
  postContainer: {
    transition: 'opacity 2s ease-in',
    padding: '0% 0% 0% 0%',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('md')]: {
      borderRadius: 0,
      minHeight: 0
    }
  },
  tweetEl: {
    color: 'white',
    width: 'max-content',
    fontFamily: 'Gilroy, sans-serif',
    border: 'none',
    maxWidth: '600px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100vw'
    },
    marginLeft: 0,
    zoom: '100%',
    marginRight: 'auto',
    marginTop: '-10px'
  }
});

class TweetPost extends PureComponent {
  render() {
    const { classes, postHOC: PostHOC, tweetObject } = this.props;

    const TweetComp = (_props) => (
      <div className={classes.postContainer}>
        <CustomTweetEmbed tweetData={tweetObject} />
      </div>
    );

    return (
      <ErrorBoundary>
        <PostHOC component={TweetComp} {...this.props} />
      </ErrorBoundary>
    );
  }
}

TweetPost.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  previewData: PropTypes.object,
  tweetObject: PropTypes.object,
  postHOC: PropTypes.element.isRequired
};

export default withStyles(styles)(TweetPost);
