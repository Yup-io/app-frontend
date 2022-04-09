import React from 'react'
import PropTypes from 'prop-types'
import { InputLabel, InputBase, FormControl, FormHelperText, withStyles } from '@material-ui/core'

const styles = theme => ({
  inputLabel: {
    color: theme.palette.M500,
    fontSize: 15,
    fontWeight: 400,
    lineHeight: '135%',
    marginTop: -20
  },
  input: {
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

const TextInput = ({ classes, label, placeholder, helperText, inputIsValid, ...restProps }) => {
  return (
    <FormControl>
      <InputLabel shrink
        className={classes.inputLabel}
      >
        {label}
      </InputLabel>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        inputProps={{
          style: {
            padding: 0
          }
        }}
        InputLabelProps={{ style: { fontSize: 40 } }}
        {...restProps}
      />
      <FormHelperText className={classes.helperText}>
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}

TextInput.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  inputIsValid: PropTypes.bool.isRequired
}

export default (withStyles(styles)(TextInput))
