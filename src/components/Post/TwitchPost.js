import dynamic from 'next/dynamic';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const ReactTwitchEmbedVideo = dynamic(
  () => import('react-twitch-embed-video'),
  { ssr: false }
);

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    padding: '0% 0% 2% 0%',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    overflowY: 'hidden'
  },
  reactPlayer: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '500px',
    minHeight: '250px',
    zIndex: 500,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0%',
      marginRight: '0%',
      height: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      maxWidth: '100vw'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '900px',
      maxHeight: '900px'
    }
  }
});

function getTwitchId(url) {
  var startIndex = url.lastIndexOf('.tv/') + 4;
  return url.substr(startIndex);
}
function TwitchPost(props) {
  const { classes, url, postHOC: PostHOC } = props;

  const TwitchComp = (_props) => (
    <div className={classes.postContainer}>
      <ReactTwitchEmbedVideo
        autoplay={false}
        channel={getTwitchId(url)}
        className={classes.reactPlayer}
        height="400px"
        layout="video"
        mute
        replay={url}
        width="550px"
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <PostHOC component={TwitchComp} {...props} />
    </ErrorBoundary>
  );
}

TwitchPost.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(withStyles(styles)(TwitchPost));
