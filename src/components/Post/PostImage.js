import React from 'react'
import PropTypes from 'prop-types'
import ImageLoader from 'react-load-image'
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  postImage: {
    width: '100%',
    height: '100%',
    maxHeight: '600px',
    maxWidth: '600px',
    marginBottom: '15px',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '0%',
      marginRight: '0%'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '600px',
      maxHeight: '900px'
    }
  } })

function PostImage ({ classes, src, alt }) {
  return (
    <ErrorBoundary>
      <ImageLoader src={src}>
        <img alt={alt}
          className={classes.postImage}
          src={src}
        />
        <img alt={alt}
          className={classes.postImage}
          src='/images/post_loading.jpg'
        />
      </ImageLoader>
    </ErrorBoundary>
  )
}

PostImage.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired

}

export default withStyles(styles)(PostImage)
