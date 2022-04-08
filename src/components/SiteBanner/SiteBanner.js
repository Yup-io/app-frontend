import React, { useState } from 'react'
import { IconButton, Icon } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import YupSnackbar from '../Miscellaneous/YupSnackbar'

const { WEB_APP_URL } = process.env

const styles = theme => ({
  root: {
    width: '100vw',
    textAlign: 'center',
    marginTop: -22,
    [theme.breakpoints.down('xs')]: {
      marginTop: 10
    },
    justifyContent: 'center',
    maxHeight: 50
  },
  message: {
    width: '100vw',
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
    localStorage.setItem('bannerClosed', true)
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
      href={`${WEB_APP_URL}/migration`}
      target='_blank'
      className={classes.link}
    >
      Yup is migrating to Polygon! Claim your YUP tokens on Polygon now 🥳
    </a>
  )

  return (
    <YupSnackbar
      open={open}
      width={800}
      autoHideDuration={1000000000}
      onClose={handleClose}
      action={action}
      leftAdornment={
        <Icon fontSize='small'
          className='fal fa-close'
        />}
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
