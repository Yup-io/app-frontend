import React, { memo } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Tuber from 'react-tuber';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0
    }
  },
  spotifyTuber: {
    width: '100%!important',
    [theme.breakpoints.down('sm')]: {
      width: '100vw!important'
    }
  }
});

function SpotifyPost(props) {
  const { classes, caption, postHOC: PostHOC } = props;
  const isMobile = window.innerWidth <= 600;

  const SpotifyComp = (_props) => (
    <div className={classes.postContainer}>
      <Tuber
        className={classes.spotifyTuber}
        src={caption}
        style={{ margin: '0 0 0 0', borderRadius: '5px 5px 0px 0px!important' }}
        width={600}
        aspect={isMobile ? '5:3' : '7:2'}
        autoplay
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <PostHOC component={SpotifyComp} {...props} />
    </ErrorBoundary>
  );
}

SpotifyPost.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(withStyles(styles)(SpotifyPost));
