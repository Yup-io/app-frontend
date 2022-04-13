import React from 'react'
import PropTypes from 'prop-types'
import { FormLabel, InputBase, FormControl, FormHelperText, withStyles } from '@material-ui/core'

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

const YupForm = ({ classes, label, error, placeholder, helperText, inputIsValid, ...restProps }) => {
  return (
    <FormControl>
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
          }
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
  label: PropTypes.string,
  error: PropTypes.bool,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  inputIsValid: PropTypes.bool.isRequired
}

export default (withStyles(styles)(YupForm))
