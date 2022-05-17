import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Image, CloudinaryContext, Transformation, Placeholder } from 'cloudinary-react'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { cloudinaryName } from '../../config'

const ROOT_CLOUDINARY_URL = `https://res.cloudinary.com/yup-io/image/upload/`
const FOUNDATION_IMG_URI = `https://f8n`

const foundationOptimizeParams = { q: 30, auto: 'format,compress', cs: 'srbg', h: 640, fm: 'png' }

const CldImg = ({ postid, src, ...restProps }) => {
  const isUploadedToCloud = src && src.startsWith(ROOT_CLOUDINARY_URL)
  const isFoundationImg = src && src.split('-')[0] === FOUNDATION_IMG_URI

  if (isFoundationImg) { // use foundation optimization params to save cloudianry credits
    return <img src={`${src}?${new URLSearchParams(foundationOptimizeParams).toString()}`} />
  }

  return (
    <ErrorBoundary>
      <CloudinaryContext cloudName={cloudinaryName}>
        <Image publicId={isUploadedToCloud ? postid : src}
          type={isUploadedToCloud ? undefined : 'fetch'}
          secure='true'
          dpr='auto'
          responsive
          width='auto'
          {...restProps}
        >
          <Placeholder type='vectorize' />
          <Transformation quality='auto'
            fetchFormat='auto'
          />
        </Image>
      </CloudinaryContext>
    </ErrorBoundary>
  )
}

CldImg.propTypes = {
  postid: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string
}

export default memo(CldImg)
