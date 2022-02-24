import React, { useState } from 'react'
import { Snackbar, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = theme => ({
  root: {
    width: '100vw',
    textAlign: 'center',
    marginTop: -22,
    maxHeight: 50
  },
  message: {
    width: '95vw',
    position: 'absolute'
  },
  link: {
    color: theme.palette.M900,
    textDecoration: 'none'
  }
})
const SiteBanner = ({ classes }) => {
  const [open, setOpen] = useState(true)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return }
    setOpen(false)
  }

  const action = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      className={classes.icon}
      onClick={handleClose}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  )

  const message = (
    <a
      href='https://yup.mirror.xyz/aGpM1O8aZS00At2KcoGsBJDtyICNxuYVrDPAqfJfs-A'
      target='_blank'
      className={classes.link}
    >
      Yup is migrating to Polygon! 🥳 Learn more here.
    </a>
  )

  return (
    <Snackbar
      open={open}
      width={800}
      autoHideDuration={1000000000}
      onClose={handleClose}
      action={action}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      message={message}
      ContentProps={{
        classes: {
          root: classes.root,
          message: classes.message
        }
      }}
    />
  )
}

SiteBanner.propTypes = {
   classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SiteBanner)
