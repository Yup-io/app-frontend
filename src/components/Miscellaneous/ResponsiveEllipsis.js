import React from 'react'
import PropTypes from 'prop-types'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'

const ResEll = responsiveHOC()(LinesEllipsis)

const ResponsiveEllipsis = ({ basedOn, ellipsis, maxLine, text, trimRight, ...restProps }) => {
  return (
    <ResEll
      basedOn={basedOn}
      ellipsis={ellipsis}
      maxLine={maxLine}
      text={text}
      trimRight={trimRight}
      {...restProps}
    />
  )
}

ResponsiveEllipsis.propTypes = {
  basedOn: PropTypes.string,
  ellipsis: PropTypes.node,
  maxLine: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  text: PropTypes.string.isRequired,
  trimRight: PropTypes.bool
}

export default ResponsiveEllipsis
