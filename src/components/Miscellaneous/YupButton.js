import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const styles = () => ({
  largeOneIconButton: {
    borderRadius: '50%',
    maxWidth: '42px',
    maxHeight: '42px',
    minWidth: '42px',
    minHeight: '42px',
    padding: 0
  },
  mediumOneIconButton: {
    borderRadius: '50%',
    maxWidth: '32px',
    maxHeight: '32px',
    minWidth: '32px',
    minHeight: '32px',
    padding: 0
  },
  smallOneIconButton: {
    borderRadius: '50%',
    maxWidth: '27px',
    maxHeight: '27px',
    minWidth: '27px',
    minHeight: '27px',
    padding: 0
  },
  sizeMedium: {
    padding: '8px 12px',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: '135%'
  }
})

const YupButton = ({ size, color, variant, classes, children, adornment, ...restProps }) => {
  const leftAdornment = adornment === 'left' || adornment === 'both' ? <ArrowForwardIcon /> : null
  const rightAdornment = adornment === 'right' || adornment === 'both' ? <ArrowForwardIcon /> : null

  let buttonSize
  if (size === 'large') buttonSize = classes.largeOneIconButton
  if (size === 'medium') buttonSize = classes.mediumOneIconButton
  if (size === 'small') buttonSize = classes.smallOneIconButton

  if (adornment === 'one') {
    return <Button color={color}
      className={buttonSize}
      variant={variant}
      {...restProps}
    ><ArrowForwardIcon fontSize={size} /></Button>
  }

  return (
    <Button
      size={size}
      color={color}
      variant={variant}
      startIcon={leftAdornment}
      endIcon={rightAdornment}
      className={size === 'medium' && classes.sizeMedium}
      {...restProps}
    >
      {children}
    </Button>
  )
}

YupButton.propTypes = {
  size: PropTypes.string.isRequired,
  color: PropTypes.string,
  variant: PropTypes.string.isRequired,
  classes: PropTypes.object,
  children: PropTypes.object.isRequired,
  adornment: PropTypes.string
}

export default (withStyles(styles)(YupButton))
