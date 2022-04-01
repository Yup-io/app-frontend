import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography, Card, Button, Snackbar, SnackbarContent, Icon } from '@material-ui/core'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import YupInput from '../../components/Miscellaneous/YupInput'
import LoaderButton from '../../components/Miscellaneous/LoaderButton'
import SubscribeDialog from '../../components/SubscribeDialog/SubscribeDialog'
import axios from 'axios'
import CountUp from 'react-countup'
import { accountInfoSelector } from '../../redux/selectors'
import { connect } from 'react-redux'
import { getAuth } from '../../utils/authentication'
import rollbar from '../../utils/rollbar'
import MetaTags from '../../components/Airdrop/MetaTags'
import { isAddress } from 'web3-utils'
import { TwitterShareButton } from 'react-share'
import Colors from '../../utils/colors'

const { WEB_APP_URL, BACKEND_API } = process.env

const styles = theme => ({
  page: {
    minHeight: '100vh',
    maxWidth: '100vw',
    backgroundColor: theme.palette.alt.second
  },
  balanceContainer: {
    borderRadius: '0.65rem',
    border: `solid 2px ${Colors.B6}`
  },
  card: {
    padding: theme.spacing(6),
    width: 450,
    boxShadow:
      `0px 0px 30px 0px ${theme.palette.shadow.first}44, 0px 0px 0.75px  ${theme.palette.shadow.first}66`,
    backgroundColor: theme.palette.alt.second,
    [theme.breakpoints.down('xs')]: {
      width: 350
    }
  },
  btn: {
    width: '100%'
  },
  twitterBtn: {
    width: '100%',
    color: '#1DA1F2',
    borderColor: '#1DA1F2'
  },
  rainbowBtn: {
    background: theme.palette.rainbowGradient
  },
  stepper: {
    position: 'fixed',
    top: 20
  }
})

class AirdropPage extends Component {
  state = {
    isLoading: false,
    polygonAddress: this.props.location.pathname.split('/')[2] || '',
    airdrop: null,
    lpAidrop: null,
    subscribeDialogOpen: false,
    snackbarMsg: null,
    activeStep: 0,
    lpClaimSuccess: false
  }
  componentDidMount () {
    const redirect = localStorage.getItem('twitterRedirect')
    setTimeout(() => {
      this.fetchAirdropData()
    }, 1000)
    if (redirect) {
      localStorage.removeItem('twitterRedirect')
    } else {
      localStorage.setItem('twitterRedirect', 'migration') // ensure twitter login process brings them back to this page
    }
  }

  handleCopy = () => navigator.clipboard.writeText(window.location.href)

  handleInput = e => this.setState({ polygonAddress: (e.target.value).toLowerCase() })

  handleSubscribeDialogClose = () => this.setState({ subscribeDialogOpen: false })
  handleSubscribeDialogOpen = () => this.setState({ subscribeDialogOpen: true })

  handleSnackbarClose = () => this.setState({ snackbarMsg: '' })

  claimAirdrop = async () => {
    const { polygonAddress, lpAidrop, lpClaimSuccess } = this.state
    const { account } = this.props
    if (!isAddress(polygonAddress)) {
      this.setState({ snackbarMsg: 'Please enter a valid polygon address' })
      return
    }

    let hasAvailableLpAirdrop = lpAidrop.amount > 0 && !lpClaimSuccess && !lpAidrop.claimed

    this.setState({ isLoading: true, activeStep: 2 })
    const auth = await getAuth(account)
    const params = { polygonAddress, eosname: account.name, ...auth }
    if (hasAvailableLpAirdrop) {
      try {
        await axios.post(`${BACKEND_API}/lp-airdrop/claim`, params)
        this.setState({ lpClaimSuccess: true, activeStep: 3 })
        hasAvailableLpAirdrop = false
      } catch (err) {
        this.setState({ snackbarMsg: err.response && err.response.data.message })
      }
    }

    try {
      await axios.post(`${BACKEND_API}/airdrop/claim`, params)
      this.setState({ activeStep: 3 })
    } catch (err) {
      rollbar.error(`Error claiming airdrop: ${JSON.stringify(err)}`)
      this.setState({ snackbarMsg: err.response && err.response.data.message })
    }

    this.setState({ isLoading: false })
  }

  fetchAirdropData = async () => {
    try {
      this.setState({ isLoading: true })
      const airdrop = (await axios.get(`${BACKEND_API}/airdrop?eosname=${this.props.account.name}`)).data
      const lpAidrop = (await axios.get(`${BACKEND_API}/lp-airdrop?eosname=${this.props.account.name}`)).data
      this.setState({ airdrop, lpAidrop, activeStep: 1 })
    } catch (err) {
      rollbar.error(`Error fetching airdrop data: ${JSON.stringify(err)}`)
      this.setState({ snackbarMsg: 'Something went wrong. Try again later.' })
    }
    this.setState({ isLoading: false })
  }

  render () {
    const { classes, account } = this.props
    const { isLoading, airdrop, lpAidrop, snackbarMsg, polygonAddress, activeStep, subscribeDialogOpen } = this.state
    const isValidAddress = isAddress(polygonAddress)

    const enableClaim = (airdrop || lpAidrop) && isValidAddress
    const shareStep = activeStep === 3

    return (
      <ErrorBoundary>
        <MetaTags polygonAddress={polygonAddress}
          airdrop={airdrop}
        />
        <Snackbar
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
          open={!!snackbarMsg}
        >
          <SnackbarContent
            message={snackbarMsg}
          />
        </Snackbar>

        <Grid className={classes.page}
          container
          direction='column'
          justify='center'
          alignItems='center'
        >
          <Card className={classes.card}
            elevation={0}
          >
            <Grid container
              alignItems='stretch'
              direction='column'
              justify='center'
              spacing={3}
            >
              <Grid
                container
                direction='row'
                justify='space-around'
              >
                <img
                  src='/images/graphics/yuppoly.png'
                  alt='yup logo'
                  height='90'
                />

              </Grid>
              <Grid item>
                <Typography
                  variant='h5'
                  align='center'
                >
                  {shareStep ? 'Congratulations. Your tokens will arrive in about 6 hours.' : 'Polygon Migration'}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant='body2'
                  align='center'
                >
                  {account && account.name ? shareStep ? "You've claimed" : 'You can claim' : 'Connect to your account to claim'}
                </Typography>
              </Grid>
              { account && account.name ? <Grid item>
                <Grid container
                  direction='column'
                >
                  <Grid item>
                    <Typography variant='h3'
                      style={{ color: airdrop ? Colors.Green : Colors.B6, textAlign: 'center' }}
                    >
                      <CountUp
                        end={airdrop && airdrop.amount}
                        decimals={2}
                        start={0}
                        duration={2}
                        suffix=' YUP'
                      />
                    </Typography>
                  </Grid>
                  {lpAidrop
                    ? <Grid item>
                      <Grid container
                        direction='column'
                        alignItems='center'
                      >
                        <Grid item>
                          <Typography
                            variant='s1'
                            style={{ opacity: 0.3 }}
                          >
                            &
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='h3'
                            style={{ color: lpAidrop ? Colors.Green : Colors.B6, textAlign: 'center' }}
                          >
                            <CountUp
                              end={lpAidrop && lpAidrop.amount}
                              decimals={2}
                              start={0}
                              duration={2}
                              suffix=' YUPETH'
                            />
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid> : null
                      }
                </Grid>
              </Grid> : null }
              { lpAidrop ? shareStep ? <Grid item>
                <Button
                  fullWidth
                  onClick={`${WEB_APP_URL}/staking`}
                  className={classes.rainbowBtn}
                  variant='contained'
                  startIcon={<Icon className='fa fa-upload' />}
                >
                  Stake
                </Button>
              </Grid> : null : null}
              {account && account.name ? <Grid item>
                <Grid container
                  spacing={2}
                  direction='column'
                >
                  <Grid item>
                    <Typography
                      variant='body2'
                      align='center'
                    >
                      {shareStep ? 'Let the people know!' : 'Input a Polygon address to link account & receive tokens'}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <YupInput
                      style={{ display: shareStep ? 'none' : 'inherit' }}
                      fullWidth
                      id='address'
                      maxLength={50}
                      label='Address'
                      type='text'
                      onSubmit={this.fetchAirdropData}
                      inputIsValid={isValidAddress}
                      value={polygonAddress}
                      variant='outlined'
                      onChange={this.handleInput}
                    />
                  </Grid>
                </Grid>
              </Grid> : '' }
              <Grid item>
                {!shareStep ? account && account.name ? (
                  <LoaderButton
                    fullWidth
                    className={classes.btn}
                    variant='contained'
                    buttonText='Claim'
                    disabled={!enableClaim}
                    isLoading={isLoading}
                    onClick={this.claimAirdrop}
                  />
            )
            : <Button
                fullWidth
                onClick={this.handleSubscribeDialogOpen}
                className={classes.btn}
                variant='contained'
              >
              Login
            </Button>
                  : <Grid container
                      direction='row'
                      alignContent='stretch'
                      spacing={1}
                    >
                    <Grid item
                      xs={6}
                    >
                      <TwitterShareButton
                        url={`${WEB_APP_URL}/migration`}
                        title={`Claiming #polygon airdrop on @yup_io`}
                        hashtags={['YUP']}
                        windowWidth={800}
                        windowHeight={600}
                        className={classes.btn}
                      >
                        <Button
                          fullWidth
                          onClick={this.handleSubscribeDialogOpen}
                          className={classes.twitterBtn}
                          variant='outlined'
                          startIcon={<Icon style={{ color: '#1DA1F2' }}
                            className='fa fa-twitter fa-2x'
                                     />}
                        >
                          Share
                        </Button>
                      </TwitterShareButton>
                    </Grid>
                    <Grid item
                      xs={6}
                    >
                      <Button
                        fullWidth
                        onClick={this.handleCopy}
                        className={classes.btn}
                        variant='outlined'
                        startIcon={<Icon className='fa fa-copy fa-2x' />}
                      >
                        Copy
                      </Button>
                    </Grid>
                  </Grid>
          }
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <SubscribeDialog
          account={account}
          noRedirect
          dialogOpen={subscribeDialogOpen}
          handleDialogClose={this.handleSubscribeDialogClose}
        />
      </ErrorBoundary>
    )
  }
}

AirdropPage.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object,
  location: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return { account }
}

export default connect(mapStateToProps)(withStyles(styles)(AirdropPage))
