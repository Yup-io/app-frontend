import React from 'react'
import PropTypes from 'prop-types'
import { InputLabel, Input, FormControl, FormHelperText, withStyles } from '@material-ui/core'

const styles = theme => ({
  input: {
    borderRadius: 8,
    backgroundColor: theme.palette.M850,
    border: `1px solid ${theme.palette.M300}`,
    fontSize: 15,
    padding: '12px 12px 12px 16px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow'
    ]),
    fontFamily: 'Gilroy',
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: theme.palette.M500,
      '&:focus': {
        color: theme.palette.M100
      }
    },
    '& input:invalid + fieldset': {
      borderColor: theme.palette.E500
    }
  },
  inputLabel: {
    color: theme.palette.M500,
    marginTop: theme.spacing(2),
    '&:focus': {
      color: theme.palette.M500
    }
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
      <Input
        className={classes.input}
        placeholder={placeholder}
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
