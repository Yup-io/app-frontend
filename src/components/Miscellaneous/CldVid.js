import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { CloudinaryContext, Transformation, Video } from 'cloudinary-react'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import ReactPlayer from 'react-player'
import { withStyles } from '@material-ui/core/styles'

const ROOT_CLOUDINARY_URL = `https://res.cloudinary.com/yup-io/video/upload/`

const styles = theme => ({
  linkImg: {
    width: '100%',
    minHeight: '15rem',
    maxHeight: '30rem',
    objectFit: 'cover',
    background: 'linear-gradient(0deg,#1b1b1b,#ffffff00,#ffffff00)',
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0
    }
  }
})

const CldVid = ({ postid, src, classes, ...restProps }) => {
  const isUploadedToCloud = src && src.startsWith(ROOT_CLOUDINARY_URL)

  if (!isUploadedToCloud) {
    return (<ReactPlayer
      className={classes.linkImg}
      style={{ overFlow: 'hidden', maxHeight: '1000px' }}
      url={src}
      height='auto'
      width='100%'
      playing
      muted
      loop
      playsinline
            />)
  }
  return (
    <ErrorBoundary>
      <CloudinaryContext cloudName={process.env.CLOUDINARY_NAME}>
        <Video publicId={postid}
          secure='true'
          controls='false'
          loop='true'
          dpr='auto'
          responsive
          autoplay='true'
          muted='true'
          width='auto'
          {...restProps}
        >
          <Transformation quality='auto'
            fetchFormat='auto'
          />
        </Video>
      </CloudinaryContext>
    </ErrorBoundary>
  )
}

CldVid.propTypes = {
  postid: PropTypes.string,
  src: PropTypes.string,
  classes: PropTypes.object
}

export default memo(withStyles(styles)(CldVid))
