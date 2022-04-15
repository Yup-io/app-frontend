import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DialogActions, DialogContent, DialogContentText, Typography, Grid, withStyles } from '@material-ui/core'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { YupButton } from '../Miscellaneous'
import YupDialog from '../Miscellaneous/YupDialog'

const styles = theme => ({
  dialog: {
    width: '100%'
  },
  dialogTitleText: {
    fontFamily: 'Gilroy',
    fontWeight: '300',
    color: theme.palette.M100,
    fontSize: '20'
  },
  dialogContentText: {
    fontFamily: 'Gilroy',
    fontWeight: '200',
    color: '#ffffff'
  },
  primaryBtn: {
    color: '#0a0a0a',
    fontWeight: '500',
    backgroundColor: '#00E08E',
    '&:hover': {
      backgroundColor: '#00bb92'
    }
  },
  linkBtn: {
    color: '#FFFFFF',
    fontWeight: '100',
    textTransform: 'capitalize',
    textDecoration: 'underline'
  },
  desktopDialogContentText: {
    display: 'inline',
    [theme.breakpoints.down('600')]: {
      display: 'none'
    }
  },
  mobileDialogContentText: {
    display: 'inline',
    [theme.breakpoints.up('600')]: {
      display: 'none'
    }
  }
})

class WelcomeDialog extends Component {
  openTour = () => {
    const { handleDialogClose, startProductTour } = this.props
    handleDialogClose()
    startProductTour()
  }

  render () {
    const { handleDialogClose, dialogOpen, classes, showProductTour } = this.props
    return (
      <ErrorBoundary>

        <YupDialog
          buttonPosition='right'
          headline='Welcome to Yup 🎉'
          open={dialogOpen}
          onClose={handleDialogClose}
          className={classes.dialog}
          aria-describedby='alert-dialog-description'
          aria-labelledby='alert-dialog-title'
        >
          <DialogContent>
            <DialogContentText>
              <Typography
                align='left'
                className={classes.dialogContentText}
                variant='h1'
              >
                <span className={classes.desktopDialogContentText}>
                  <div style={{ opacity: 0.6, marginBottom: '10px' }}>
                    Your Yup account has been created! Your Twitter likes and tweets will now earn you influence and rewards on Yup.
                  </div>
                  To rate directly from your computer, download the Yup extension.
                  You must use the Yup extension to redeem rewards of all kinds.
                </span>
                <span className={classes.mobileDialogContentText}>
                  <div style={{ opacity: 0.6, marginBottom: '10px' }}>
                    Your Yup account has been created! Your Twitter likes and tweets will now earn you influence and rewards on Yup.
                  </div>
                  To rate directly from your computer, download the Yup extension.
                  You must use the Yup extension to redeem rewards of all kinds.
                </span>
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container
              direction='column'
              justify='space-between'
              alignItems='center'
            >
              <Grid item
                className={classes.desktopDialogContentText}
              >
                <YupButton wide
                  className={classes.primaryBtn}
                  href='https://chrome.google.com/webstore/detail/yup-the-opinion-layer-of/nhmeoaahigiljjdkoagafdccikgojjoi?hl=en'
                >Download Yup Extension</YupButton>
              </Grid>
              { showProductTour && <>
                <Grid item
                  className={classes.desktopDialogContentText}
                >
                  <YupButton
                    className={classes.linkBtn}
                    onClick={this.openTour}
                  >10 second tutorial</YupButton>
                </Grid>
                <Grid item
                  className={classes.mobileDialogContentText}
                >
                  <YupButton fullWidth
                    className={classes.primaryBtn}
                    onClick={this.openTour}
                  >10 Second Tutorial</YupButton>
                </Grid>
                </>}
            </Grid>
          </DialogActions>
        </YupDialog>
      </ErrorBoundary>
    )
  }
}

WelcomeDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  showProductTour: PropTypes.bool,
  startProductTour: PropTypes.func.isRequired,
  handleDialogClose: PropTypes.func.isRequired
}
export default withStyles(styles)(WelcomeDialog)
