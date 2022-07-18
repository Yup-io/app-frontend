import React, { PureComponent } from 'react';
import CustomWeb3PostEmbed from '../CustomWeb3PostEmbed/CustomWeb3PostEmbed';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import './tweet.module.css';
import Original from '../CustomWeb3PostEmbed/Original';

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

class Web3Post extends PureComponent {
  render() {
    const { classes, postHOC: PostHOC, tweetObject, previewData } = this.props;

    const Web3PostComp = (_props) => (
      <div className={classes.postContainer}>
        <CustomWeb3PostEmbed previewData={previewData} />
      </div>
    );

    return (
      <ErrorBoundary>
        <PostHOC component={Web3PostComp} {...this.props} />
      </ErrorBoundary>
    );
  }
}

Web3Post.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  previewData: PropTypes.object,
  tweetObject: PropTypes.object,
  postHOC: PropTypes.element.isRequired
};

export default withStyles(styles)(Web3Post);
