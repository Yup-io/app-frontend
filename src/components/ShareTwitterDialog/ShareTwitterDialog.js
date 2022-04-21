import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, DialogContentText, Typography, Grid } from '@mui/material'
import withStyles from '@mui/styles/withStyles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import LoaderButton from '../Miscellaneous/LoaderButton'
import { TwitterShareButton } from 'react-share'
import Colors from '../../utils/colors'

const styles = theme => ({
  dialog: {
    width: '100%'
  },
  twitterButton: {
    width: '100%'
  },
  loaderButton: {
    background: Colors.Green
  }
})
class ShareTwitterDialog extends Component {
  render () {
    const { handleDialogClose, dialogOpen, classes, headerText, bodyText, tweetTitle, url } = this.props
    return (
      <ErrorBoundary >
        <Dialog open={dialogOpen}
          onClose={() => handleDialogClose()}
          aria-labelledby='form-dialog-title'
          className={classes.dialog}
        ><DialogTitle style={{ paddingBottom: '10px' }}>
            <Typography
              align='left'
              // className={classes.dialogTitleText}
              variant='h3'
            >
              {headerText}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ padding: '20px 0px' }}>
              <Typography
                align='left'
                // className={classes.dialogContentText}
                variant='h5'
              >
                <span className={classes.desktop}>
                  {bodyText}
                </span>
              </Typography>
            </DialogContentText>
            <TwitterShareButton
              className={classes.twitterButton}
              url={url}
              title={tweetTitle}
              hashtags={['YUP']}
              windowWidth={20000}
              windowHeight={20000}
              onShareWindowClose={() => handleDialogClose()}
            > <Grid container
                alignItems='center'
                spacing={1}
                className={classes.twitterButton}
              >
                <Grid item
                  className={classes.twitterButton}
                >
                  <LoaderButton
                    className={classes.loaderButton}
                    fullWidth
                    buttonText='Share on Twitter'
                    variant='contained'
                  />
                </Grid>
              </Grid>
            </TwitterShareButton>
          </DialogContent>
        </Dialog>
      </ErrorBoundary>
    )
  }
}

ShareTwitterDialog.propTypes = {
  classes: PropTypes.object,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  bodyText: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  tweetTitle: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired
}
export default withStyles(styles)(ShareTwitterDialog)
