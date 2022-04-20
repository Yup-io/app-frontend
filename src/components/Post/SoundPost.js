import React, { memo } from 'react'
import ReactPlayer from 'react-player'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  postContainer: {
    display: 'flex',
    padding: '0% 0% 2% 0%',
    [theme.breakpoints.down('xs')]: {
    },
    alignItems: 'center'
  },
  reactPlayer: {
    width: '100%',
    height: '300px',
    maxHeight: '300px',
    maxWidth: '600px',
    minHeight: '250px',
    zIndex: 500,
    backgroundColor: '#000',
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
      height: '150px'
    }
  },
  divider: {
    [theme.breakpoints.up('580')]: {
      display: 'none'
    }
  }
})

function SoundPost (props) {
  const { classes, caption, postHOC: PostHOC } = props

  const SoundComp = (_props) => (
    <div className={classes.postContainer}>
      <ReactPlayer
        className={classes.reactPlayer}
        controls
        style={{ overFlow: 'hidden', maxHeight: '300px' }}
        url={caption}
        width='100%'
      />
    </div>
  )

  return (
    <ErrorBoundary>
      <PostHOC
        component={SoundComp}
        {...props}
      />
    </ErrorBoundary>
  )
}

SoundPost.propTypes = {
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postHOC: PropTypes.element.isRequired
}

export default memo(withStyles(styles)(SoundPost))
