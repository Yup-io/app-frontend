import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CourseComp from './CourseComp.js'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

function CoursePost (props) {
  const { caption, postHOC: PostHOC } = props
  const CoursePreview = (props) => (<CourseComp caption={caption} />)
  return (
    <ErrorBoundary>
      <PostHOC
        component={CoursePreview}
        {...props}
      />
    </ErrorBoundary>
  )
}

CoursePost.propTypes = {
  caption: PropTypes.string.isRequired,
  postHOC: PropTypes.element.isRequired
}

export default memo(CoursePost)
