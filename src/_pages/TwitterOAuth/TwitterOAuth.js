import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { useRouter } from 'next/router';
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
import { useEffect } from 'react';
import { useState } from 'react';

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

const TwitterOAuth = ({ classes }) => {
  const router = useRouter();
  const [existingAcct, setExistingAcct] = useState();
  const [username, setUsername] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const { token } = router.query;
  const pathname = router.pathname.split('/');
  console.log(router, token);
  useEffect(() => {
    if (token) createAccount();
  }, [token]);
  useEffect(() => {
    if (username) {
      const customRedirect = localStorage.getItem('twitterRedirect');
      router.push(
        customRedirect ? '/' + customRedirect : '/account/' + username
      );
    }
  }, [username]);

  const createAccount = () => {
    (async () => {
      try {
        console.log(router, token);
        if (pathname.pop() === 'redirect') {
          setExistingAcct(true);
        }
        const res = await axios.post(
          `${apiBaseUrl}/accounts/twitter/mirror/create`,
          { token }
        );

        const twitterInfo = {
          name: res.data.account.eosname,
          isMirror: true,
          seenTutorial: existingAcct,
          token: token,
          expiration: res.data.expiration
        };
        localStorage.setItem('twitterMirrorInfo', JSON.stringify(twitterInfo));
        setIsLoading(false);
        setUsername(res.data.account.username);
      } catch (err) {
        if (
          err.toString().includes('Error: Request failed with status code 429')
        ) {
          setErrorMessage(
            'Request failed. You have attempted to create too many accounts.'
          );
        }
        setIsLoading(false);
      }
    })();
  };

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
};

TwitterOAuth.propTypes = {
  classes: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};

export default withStyles(styles)(TwitterOAuth);
