
import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'

const TweetVidPlayer = ({ url }) => {
  if (!url) return null
  return (
    <ReactPlayer
      controls
      url={url}
      width={'100%'}
      height={'100%'}
    />

  )
}
TweetVidPlayer.propTypes = {
  url: PropTypes.string.isRequired
}

export default TweetVidPlayer
