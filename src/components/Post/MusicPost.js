import React, { memo } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Embed from 'react-music-embed';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const styles = (theme) => ({
  postContainer: {
    display: 'flex',
    padding: '0% 0% 2% 0%',
    marginBottom: '12px',
    alignItems: 'center',
    backgroundColor: '#F8F8FA',
    borderRadius: '0.5rem'
  }
});

function MusicPost(props) {
  const { classes, url, postHOC: PostHOC } = props;

  const MusicComp = (_props) => (
    <div className={classes.postContainer}>
      <Embed
        url={url}
        style={{ fontFamily: 'Nunito, sansSerif!important' }}
        width={600}
        aspect="7:3"
        autoplay
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <PostHOC component={MusicComp} {...props} />
    </ErrorBoundary>
  );
}

MusicPost.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
};

export default memo(withStyles(styles)(MusicPost));
