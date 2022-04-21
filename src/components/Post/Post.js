import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'
import withStyles from '@mui/styles/withStyles'
import { hashToUrl } from '../../utils/ipfs'
import PostImage from './PostImage'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  reactPlayer: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '600px',
    minHeight: '250px',
    zIndex: 50000,
    backgroundColor: '#000',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0%',
      marginRight: '0%',
      height: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: '0px'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '600px',
      maxHeight: '900px'
    }
  },
  postImage: {
    width: '100%',
    height: '100%',
    minHeight: '1000px',
    minWidth: '1000px',
    marginBottom: '10px',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '1200px',
      maxHeight: '1200px'
    }
  }
})

function Post (props) {
  const { classes, image, video, postHOC: PostHOC } = props

  const PostComp = (_props) => (
    image && image.trim().length
      ? <PostImage className={classes.postImage}
        src={hashToUrl(image)}
      />
      : <ReactPlayer
        autoPlay
        className={classes.reactPlayer}
        controls
        muted
        style={{
          overFlow: 'hidden',
          borderRadius: '0.5rem',
          maxHeight: '1000px',
          height: '0px'
        }}
        url={hashToUrl(video)}
        width='100%'
      />
  )
  return (
    <ErrorBoundary>
      <PostHOC
        component={PostComp}
        {...props}
      />
    </ErrorBoundary>
  )
}

Post.propTypes = {
  nickname: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  votes: PropTypes.number.isRequired,
  weights: PropTypes.object.isRequired,
  quantiles: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  account: PropTypes.object,
  video: PropTypes.string.isRequired,
  level: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
}

export default memo(withStyles(styles)(Post))
