import React from 'react'
import PropTypes from 'prop-types'
import { FormLabel, InputBase, FormControl, FormHelperText, InputAdornment, IconButton, withStyles } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

const styles = theme => ({
  formLabel: {
    color: theme.palette.M500,
    fontSize: 15,
    fontWeight: 400,
    lineHeight: '135%'
  },
  inputBase: {
    borderRadius: 8,
    backgroundColor: theme.palette.M850,
    border: `1px solid ${theme.palette.M300}`,
    padding: '12px 12px 12px 16px',
    fontWeight: 400,
    fontSize: 15,
    lineHeight: '135%',
    fontFamily: 'Gilroy',
    color: theme.palette.M500,
    textOverflow: 'ellipsis !important'
  },
  helperText: {
    color: theme.palette.M500,
    fontWeight: 400,
    fontSize: 15,
    lineHeight: '135%',
    fontFamily: 'Gilroy'
  }
})

const YupForm = ({ classes, maxLength, fullWidth, onSubmit, label, error, placeholder, helperText, inputIsValid, endAdornment, ...restProps }) => {
  const arrowEndAdornment = onSubmit
    ? <InputAdornment position='end'>
      <IconButton
        onClick={onSubmit}
        edge='end'
      >
        <ArrowForwardIcon style={{ opacity: inputIsValid ? 1 : 0.5 }} />
      </IconButton>
    </InputAdornment> : null

  return (
    <FormControl fullWidth={fullWidth} >
      <FormLabel shrink
        className={classes.formLabel}
        error={error}
      >
        {label}
      </FormLabel>
      <InputBase
        className={classes.inputBase}
        placeholder={placeholder}
        error={error}
        inputProps={{
          style: {
            padding: 0
          },
          maxLength
        }}
        InputProps={{
          endAdornment: endAdornment || arrowEndAdornment
        }}
        {...restProps}
      />
      <FormHelperText
        className={classes.helperText}
        error={error}
      >
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}

YupForm.propTypes = {
  classes: PropTypes.object.isRequired,
  maxLength: PropTypes.number,
  fullWidth: PropTypes.bool,
  onSubmit: PropTypes.func,
  label: PropTypes.string,
  error: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  inputIsValid: PropTypes.bool.isRequired,
  endAdornment: PropTypes.symbol
}

export default (withStyles(styles)(YupForm))
