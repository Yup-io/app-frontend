import React, { memo } from 'react'
import ReactPlayer from 'react-player'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  postContainer: {
    display: 'flex',
    padding: '0% 0% 2% 0%',
    alignItems: 'center',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0
    }
  },
  reactPlayer: {
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    maxWidth: '600px',
    minHeight: '250px',
    zIndex: 50,
    overflow: 'hidden',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0%',
      marginRight: '0%',
      height: 'auto'
    },
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
      maxWidth: '100vw',
      width: '100vw'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '600px',
      maxHeight: '900px'
    }
  }
})

function VideoPost (props) {
  const { classes, caption, postHOC: PostHOC } = props
  const isMobile = window.innerWidth <= 600
  const heightProp = isMobile ? { height: '0' } : {}

  const VideoComp = (_props) => (
    <div className={classes.postContainer}>
      <ReactPlayer
        className={classes.reactPlayer}
        controls
        style={{ overFlow: 'hidden', maxHeight: '1000px' }}
        url={caption}
        width='100%'
        {...heightProp}
      />
    </div>
  )
  return (
    <ErrorBoundary>
      <PostHOC
        component={VideoComp}
        {...props}
      />
    </ErrorBoundary>
  )
}

VideoPost.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
}

export default memo(withStyles(styles)(VideoPost))
