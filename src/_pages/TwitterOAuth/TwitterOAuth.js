import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'next/router';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import axios from 'axios';
import { PageBody } from '../pageLayouts';
import { apiBaseUrl } from '../../config';
import { windowExists } from '../../utils/helpers';
import LoadingSpin from '../../LoadingSpin';

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    marginLeft: 0,
    paddingBottom: '20px'
  },
  page: {
    flex: 1,
    background: 'transparent',
    width: '100%',
    objectFit: 'cover',
    margin: 0
  },
  gridContainer: {
    paddingTop: theme.spacing(6),
    [theme.breakpoints.down('xl')]: {
      paddingTop: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(10)
    }
  },
  messageFailure: {
    paddingTop: '5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '3vh',
    color: theme.palette.E400
  },
  messageLoad: {
    paddingTop: '5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '100',
    fontSize: '20px',
    color: theme.palette.M50
  }
});

class TwitterOAuth extends Component {
  state = {
    isLoading: true,
    username: null,
    existingAcct: false,
    errorMessage: 'Failed to create your account'
  };

  componentDidMount() {
    this.createAccount();
  }

  createAccount = () => {
    (async () => {
      try {
        const { router } = this.props;
        const pathname = router.pathname.split('/');
        const token = pathname.pop();
        if (pathname.pop() === 'redirect') {
          this.setState({ existingAcct: true });
        }
        const res = await axios.post(
          `${apiBaseUrl}/accounts/twitter/mirror/create`,
          { token }
        );

        const twitterInfo = {
          name: res.data.account.eosname,
          isMirror: true,
          seenTutorial: this.state.existingAcct,
          token: token,
          expiration: res.data.expiration
        };
        localStorage.setItem('twitterMirrorInfo', JSON.stringify(twitterInfo));
        this.setState({
          isLoading: false,
          username: res.data.account.username
        });
        // reload because of unknown race condition
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch (err) {
        if (
          err.toString().includes('Error: Request failed with status code 429')
        ) {
          this.setState({
            errorMessage:
              'Request failed. You have attempted to create too many accounts.'
          });
        }
        this.setState({ isLoading: false });
      }
    })();
  };

  render() {
    const { classes } = this.props;
    const customRedirect = windowExists()
      ? localStorage.getItem('twitterRedirect')
      : null;
    const { isLoading, username, existingAcct, errorMessage } = this.state;
    if (isLoading) {
      return (
        <PageBody
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Grid
            container
            display="flex"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item container alignItems="center" justifyContent="center">
              <LoadingSpin />
            </Grid>
            <Grid item>
              {existingAcct ? (
                <Typography className={classes.messageLoad}>
                  Redirecting you to your account...
                </Typography>
              ) : (
                <Typography className={classes.messageLoad}>
                  Creating account...this may take a minute...
                </Typography>
              )}
            </Grid>
          </Grid>
        </PageBody>
      );
    }

    if (username !== null) {
      return <Redirect to={`/${customRedirect || username}`} />;
    }

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <PageBody pageClass={classes.page}>
            <Grid
              alignItems="flex-start"
              className={classes.gridContainer}
              container
              justifyContent="center"
            >
              <Typography className={classes.messageFailure} constiant="h1">
                {errorMessage}
              </Typography>
            </Grid>
          </PageBody>
        </div>
      </ErrorBoundary>
    );
  }
}

TwitterOAuth.propTypes = {
  classes: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(TwitterOAuth));
