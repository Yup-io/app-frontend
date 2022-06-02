import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Card,
  Snackbar,
  SnackbarContent,
  Icon
} from '@mui/material';
import { withRouter } from 'next/router';
import withStyles from '@mui/styles/withStyles';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import {
  YupInput,
  YupButton,
  LoaderButton
} from '../../components/Miscellaneous';
import axios from 'axios';
import CountUp from 'react-countup';
import { accountInfoSelector } from '../../redux/selectors';
import { connect } from 'react-redux';
import { getAuth } from '../../utils/authentication';
import rollbar from '../../utils/rollbar';
import MetaTags from '../../components/Airdrop/MetaTags';
import { isAddress } from 'web3-utils';
import { TwitterShareButton } from 'react-share';
import { Mono, Prime } from '../../utils/colors';
import { PageBody } from '../pageLayouts';
import AuthModal from '../../features/AuthModal';
import { apiBaseUrl, webAppUrl } from '../../config';

const styles = (theme) => ({
  page: {
    minHeight: '100vh',
    maxWidth: '100vw',
    backgroundColor: theme.palette.M900
  },
  balanceContainer: {
    borderRadius: '0.65rem',
    border: `solid 2px ${theme.palette.M700}`
  },
  card: {
    padding: theme.spacing(6),
    width: 450,
    boxShadow: `0px 0px 30px 0px ${theme.palette.M400}44, 0px 0px 0.75px  ${theme.palette.M400}66`,
    backgroundColor: theme.palette.M900,
    [theme.breakpoints.down('md')]: {
      width: 350
    }
  },
  twitterBtn: {
    width: '100%',
    color: '#1DA1F2',
    borderColor: '#1DA1F2'
  },
  rainbowBtn: {
    background: theme.gradients.horizontal
  },
  stepper: {
    position: 'fixed',
    top: 20
  }
});

class AirdropPage extends Component {
  state = {
    isLoading: false,
    polygonAddress: this.props.router.pathname.split('/')[2] || '',
    airdrop: null,
    lpAidrop: null,
    subscribeDialogOpen: false,
    snackbarMsg: null,
    activeStep: 0,
    lpClaimSuccess: false
  };
  componentDidMount() {
    const redirect = localStorage.getItem('twitterRedirect');
    setTimeout(() => {
      this.fetchAirdropData();
    }, 1000);
    if (redirect) {
      localStorage.removeItem('twitterRedirect');
    } else {
      localStorage.setItem('twitterRedirect', 'migration'); // ensure twitter login process brings them back to this page
    }
  }

  handleCopy = () => navigator.clipboard.writeText(window.location.href);

  handleInput = (e) =>
    this.setState({ polygonAddress: e.target.value.toLowerCase() });

  handleSubscribeDialogClose = () =>
    this.setState({ subscribeDialogOpen: false });
  handleSubscribeDialogOpen = () =>
    this.setState({ subscribeDialogOpen: true });

  handleSnackbarClose = () => this.setState({ snackbarMsg: '' });

  claimAirdrop = async () => {
    const { polygonAddress, lpAidrop, lpClaimSuccess } = this.state;
    const { account } = this.props;
    if (!isAddress(polygonAddress)) {
      this.setState({ snackbarMsg: 'Please enter a valid polygon address' });
      return;
    }

    let hasAvailableLpAirdrop =
      lpAidrop.amount > 0 && !lpClaimSuccess && !lpAidrop.claimed;

    this.setState({ isLoading: true, activeStep: 2 });
    const auth = await getAuth(account);
    const params = { polygonAddress, eosname: account.name, ...auth };
    if (hasAvailableLpAirdrop) {
      try {
        await axios.post(`${apiBaseUrl}/lp-airdrop/claim`, params);
        this.setState({ lpClaimSuccess: true, activeStep: 3 });
        hasAvailableLpAirdrop = false;
      } catch (err) {
        this.setState({
          snackbarMsg: err.response && err.response.data.message
        });
      }
    }

    try {
      await axios.post(`${apiBaseUrl}/airdrop/claim`, params);
      this.setState({ activeStep: 3 });
    } catch (err) {
      rollbar.error(`Error claiming airdrop: ${JSON.stringify(err)}`);
      this.setState({ snackbarMsg: err.response && err.response.data.message });
    }

    this.setState({ isLoading: false });
  };

  fetchAirdropData = async () => {
    try {
      this.setState({ isLoading: true });
      const airdrop = (
        await axios.get(
          `${apiBaseUrl}/airdrop?eosname=${this.props.account.name}`
        )
      ).data;
      const lpAidrop = (
        await axios.get(
          `${apiBaseUrl}/lp-airdrop?eosname=${this.props.account.name}`
        )
      ).data;
      this.setState({ airdrop, lpAidrop, activeStep: 1 });
    } catch (err) {
      rollbar.error(`Error fetching airdrop data: ${JSON.stringify(err)}`);
      this.setState({ snackbarMsg: 'Something went wrong. Try again later.' });
    }
    this.setState({ isLoading: false });
  };

  render() {
    const { classes, account } = this.props;
    const {
      isLoading,
      airdrop,
      lpAidrop,
      snackbarMsg,
      polygonAddress,
      activeStep,
      subscribeDialogOpen
    } = this.state;
    const isValidAddress = isAddress(polygonAddress);

    const enableClaim = (airdrop || lpAidrop) && isValidAddress;
    const shareStep = activeStep === 3;

    return (
      <ErrorBoundary>
        <MetaTags polygonAddress={polygonAddress} airdrop={airdrop} />
        <Snackbar
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
          open={!!snackbarMsg}
        >
          <SnackbarContent message={snackbarMsg} />
        </Snackbar>

        <PageBody className={classes.page}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={classes.page}
          >
            <Card className={classes.card} elevation={0}>
              <Grid
                container
                alignItems="stretch"
                direction="column"
                justifyContent="center"
                spacing={3}
              >
                <Grid container direction="row" justifyContent="space-around">
                  <img
                    src="/images/graphics/yuppoly.png"
                    alt="yup logo"
                    height="90"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5" align="center">
                    {shareStep
                      ? 'Congratulations. Your tokens will arrive in about 6 hours.'
                      : 'Polygon Migration'}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" align="center">
                    {account && account.name
                      ? shareStep
                        ? "You've claimed"
                        : 'You can claim'
                      : 'Connect to your account to claim'}
                  </Typography>
                </Grid>
                {account && account.name ? (
                  <Grid item>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography
                          variant="h3"
                          style={{
                            color: airdrop ? Prime.P500 : Mono.M900,
                            textAlign: 'center'
                          }}
                        >
                          <CountUp
                            end={airdrop && airdrop.amount}
                            decimals={2}
                            start={0}
                            duration={2}
                            suffix=" YUP"
                          />
                        </Typography>
                      </Grid>
                      {lpAidrop ? (
                        <Grid item>
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography variant="s1" style={{ opacity: 0.3 }}>
                                &
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="h3"
                                style={{
                                  color: lpAidrop ? Prime.P500 : Mono.M900,
                                  textAlign: 'center'
                                }}
                              >
                                <CountUp
                                  end={lpAidrop && lpAidrop.amount}
                                  decimals={2}
                                  start={0}
                                  duration={2}
                                  suffix=" YUPETH"
                                />
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ) : null}
                    </Grid>
                  </Grid>
                ) : null}
                {lpAidrop ? (
                  shareStep ? (
                    <Grid item>
                      <YupButton
                        fullWidth
                        onClick={`${webAppUrl}/staking`}
                        className={classes.rainbowBtn}
                        variant="contained"
                        startIcon={<Icon className="fa fa-upload" />}
                      >
                        Stake
                      </YupButton>
                    </Grid>
                  ) : null
                ) : null}
                {account && account.name ? (
                  <Grid item>
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        <Typography variant="body2" align="center">
                          {shareStep
                            ? 'Let the people know!'
                            : 'Input a Polygon address to link account & receive tokens'}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <YupInput
                          style={{ display: shareStep ? 'none' : 'inherit' }}
                          fullWidth
                          id="address"
                          maxLength={50}
                          label="Address"
                          type="text"
                          onSubmit={this.fetchAirdropData}
                          inputIsValid={isValidAddress}
                          value={polygonAddress}
                          variant="outlined"
                          onChange={this.handleInput}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  ''
                )}
                <Grid item>
                  {!shareStep ? (
                    account && account.name ? (
                      <LoaderButton
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        buttonText="Claim"
                        disabled={!enableClaim}
                        isLoading={isLoading}
                        onClick={this.claimAirdrop}
                      />
                    ) : (
                      <YupButton
                        fullWidth
                        onClick={this.handleSubscribeDialogOpen}
                        variant="contained"
                        color="primary"
                      >
                        Login
                      </YupButton>
                    )
                  ) : (
                    <Grid
                      container
                      direction="row"
                      alignContent="stretch"
                      spacing={1}
                    >
                      <Grid item xs={6}>
                        <TwitterShareButton
                          url={`${webAppUrl}/migration`}
                          title={`Claiming #polygon airdrop on @yup_io`}
                          hashtags={['YUP']}
                          windowWidth={800}
                          windowHeight={600}
                        >
                          <YupButton
                            fullWidth
                            onClick={this.handleCopy}
                            variant="outlined"
                            color="secondary"
                            startIcon={<Icon className="fa fa-copy fa-2x" />}
                          >
                            Copy
                          </YupButton>
                        </TwitterShareButton>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </PageBody>
        {/* TODO: Use `useAuthModal` after converting to functional component. */}
        <AuthModal
          noRedirect
          open={subscribeDialogOpen}
          onClose={this.handleSubscribeDialogClose}
        />
      </ErrorBoundary>
    );
  }
}

AirdropPage.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object,
  router: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state);
  return { account };
};

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(AirdropPage))
);
