import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DialogContentText, Typography, Grid } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { LoaderButton } from '../Miscellaneous';
import { TwitterShareButton } from 'react-share';
import { Brand } from '../../utils/colors';
import YupDialog from '../Miscellaneous/YupDialog';

const styles = (theme) => ({
  dialog: {
    width: '100%'
  },
  twitterButton: {
    width: '100%'
  },
  loaderButton: {
    background: Brand.mint
  }
});
class ShareTwitterDialog extends Component {
  render() {
    const {
      handleDialogClose,
      dialogOpen,
      classes,
      headerText,
      bodyText,
      tweetTitle,
      url
    } = this.props;
    return (
      <ErrorBoundary>
        <YupDialog
          buttonPosition="right"
          headLine={headerText}
          open={dialogOpen}
          onClose={handleDialogClose}
          className={classes.dialog}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogContentText style={{ padding: '20px 0px' }}>
            <Typography
              align="left"
              // className={classes.dialogContentText}
              variant="h5"
            >
              <span className={classes.desktop}>{bodyText}</span>
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
          >
            {' '}
            <Grid
              container
              alignItems="center"
              spacing={1}
              className={classes.twitterButton}
            >
              <Grid item className={classes.twitterButton}>
                <LoaderButton
                  className={classes.loaderButton}
                  fullWidth
                  buttonText="Share on Twitter"
                  variant="contained"
                />
              </Grid>
            </Grid>
          </TwitterShareButton>
        </YupDialog>
      </ErrorBoundary>
    );
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
};
export default withStyles(styles)(ShareTwitterDialog);
