import React from 'react'
import PropTypes from 'prop-types'
import { TextField, InputAdornment, IconButton, withStyles } from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

const styles = theme => ({
  input: {
    color: theme.palette.M500,
    cssUnderline: {
      '&:after': {
        borderBottomColor: theme.palette.M500
      }
    },
    fontFamily: 'Gilroy'
  },
  inputRoot: {
    color: theme.palette.M500
  },
  inputInput: {
    color: theme.palette.M500
  },
  inputUnderline: {
    borderBottomColor: theme.palette.M500
  },
  textField: {
    color: theme.palette.M500,
    flexWrap: 'none',
    fontFamily: 'Gilroy'
  }
})

const YupInput = ({ classes, maxLength, onSubmit, inputIsValid, endAdornment, ...restProps }) => {
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
    <TextField
      {...restProps}
      className={classes.textField}
      inputProps={{ maxLength }}
      InputProps={{
        endAdornment: endAdornment || arrowEndAdornment,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
          underline: classes.inputUnderline
        },
        className: classes.input
        }}
    />
  )
}

YupInput.propTypes = {
  classes: PropTypes.object.isRequired,
  maxLength: PropTypes.number,
  onSubmit: PropTypes.func,
  inputIsValid: PropTypes.bool.isRequired,
  endAdornment: PropTypes.symbol.isRequired
}

export default (withStyles(styles)(YupInput))
