import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player/lazy';

const TweetVidPlayer = ({ url }) => {
  if (!url) return null;
  return <ReactPlayer controls url={url} width={'100%'} height={'97%'} style={{ borderRadius: 12, overflow: 'hidden' }} />;
};
TweetVidPlayer.propTypes = {
  url: PropTypes.string.isRequired
};

export default TweetVidPlayer;
