import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { DialogContent, DialogContentText, TextField, Typography, CircularProgress, Stepper, Step, StepLabel, StepContent, InputAdornment, FormControl, Icon, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import { convertUtf8ToHex } from '@walletconnect/utils'
import Portal from '@material-ui/core/Portal'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { updateEthAuthInfo } from '../../redux/actions'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import { YupButton, YupInput } from '../Miscellaneous'
import { getPolygonProvider, getPolygonWeb3Modal, getWeb3InstanceOfProvider } from '../../utils/eth'
import YupDialog from '../Miscellaneous/YupDialog'

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i

const { BACKEND_API } = process.env
const ERROR_MSG = `Unable to link your account. Please try again.`
const INVALID_EMAIL_ERROR_MSG = `Please enter a valid email address.`
const WHITELIST_MSG = 'Your Ethereum address is not whitelisted.'
const VALIDATE_MSG = 'Username is invalid. Please try again.'
// const NOTMAINNET_MSG = 'Please connect with a mainnet address.'
const EMAIL_MSG = 'Success. We will get back to you soon.'
const MIRROR_MSG = 'Please wait while we create your YUP account...'
const REDIRECT_MSG = 'Success! Redirecting to your Yup account profile.'

const styles = theme => ({
  buttons: {
    backgroundColor: 'transparent',
    fontWeight: '400',
    fontSize: '14px'
  },
  platforms: {
    width: '100%',
    fontSize: '16px',
    textTransform: 'none',
    margin: '5px 0'
  },
  walletConnectIcon: {
    maxWidth: '4vw',
    width: '20px',
    height: 'auto',
    float: 'right'
  },
  twitterIcon: {
    maxWidth: '4vw',
    width: '20px',
    height: 'auto',
    float: 'right'
  },
  loader: {
    float: 'right'
  },
  outline: {
    borderColor: '#AAAAAA'
  },
  input: {
    padding: '5px',
    color: '#aaa'
  },
  desktop: {
    display: 'inline',
    [theme.breakpoints.down('600')]: {
      display: 'none'
    }
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  snack: {
    color: '#fff8f3',
    justifyContent: 'center'
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  stepperInput: {
    width: '250px',
    padding: '5px',
    [theme.breakpoints.down('sm')]: {
      width: '160px'
    }
  }
})

class SubscribeDialog extends Component {
  state = {
    email: '',
    EthIsLoading: false,
    OAuthIsLoading: false,
    connected: false,
    account: null,
    signature: '',
    address: '',
    showWhitelist: false,
    showUsername: false,
    username: '',
    steps: ['Connect Ethereum Account', 'Verify Ownership'],
    activeStep: 0,
    snackbar: {
      open: false,
      error: true,
      content: ''
    },
    walletConnectOpen: false
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value })
  }

  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value })
  }

  getStepContent = (step) => {
    switch (step) {
    case 0:
      return 'Connect your account from your mobile device.'
    case 1:
      return 'Sign the message on your mobile device to confirm your account ownership.'
    case 2:
      return this.state.showWhitelist ? 'Your address needs to be whitelisted. Please add your email so we can notify you.' : 'Please enter a Yup username to create your account.'
    }
  }

  initWalletConnect = async () => {
    if (this.state.walletConnectOpen) { return }
    this.setState({ walletConnectOpen: true })
    this.onDisconnect()

    const provider = await getPolygonProvider(getPolygonWeb3Modal())

    await this.subscribeToEventsProvider(provider)
  }

  subscribeToEventsProvider = async (provider) => {
    if (!provider) {
      this.setState({ walletConnectOpen: false })
      return
    }
    provider.on('accountsChanged', (accounts) => {
      // Should handle in the future
    })
    // Subscribe to provider disconnection
    provider.on('disconnect', () => {
      this.onDisconnect()
    })

    try {
      const web3 = await getWeb3InstanceOfProvider(provider)
      const accounts = await web3.eth.getAccounts()

      // if (chainId !== Number(POLY_CHAIN_ID) || chainId !== Number(POLY_CHAIN_ID)) {
      //   this.handleSnackbarOpen(NOTMAINNET_MSG, true)
      //   this.onDisconnect()
      //   return
      // }

      this.handleSnackbarOpen('Successfully connected.', false)
      this.setState({
        connected: true,
        activeStep: 1
      })

      const address = accounts[0]
      const challenge = (await axios.get(`${BACKEND_API}/v1/eth/challenge`, { params: { address } })).data.data
      const hexMsg = convertUtf8ToHex(challenge)
      const signature = await web3.eth.personal.sign(hexMsg, address)

      this.setState({
        address,
        signature
      })

      try {
        await axios.post(`${BACKEND_API}/v1/eth/challenge/verify`, { address, signature })
      } catch (err) {
        // fetch new challenge and signature
        this.handleSnackbarOpen(ERROR_MSG, true)
        return
      }

      const ethAuth = {
        challenge,
        signature,
        address
      }

      localStorage.setItem('YUP_ETH_AUTH', JSON.stringify(ethAuth))

      try {
        await axios.get(`${BACKEND_API}/v1/eth/whitelist/${address}`)
      } catch (err) {
        if (err.message.startsWith('Account is not whitelisted')) {
          this.handleSnackbarOpen(WHITELIST_MSG, true)
          this.setState({
            steps: [...this.state.steps, 'Ethereum Whitelist Application'],
            activeStep: 2,
            showWhitelist: true
          })
          return
        }
      }

      // check if account already claimed
      let account
      try {
        account = (await axios.get(`${BACKEND_API}/accounts/eth?address=${address}`)).data
      } catch (err) {
        // not claimed -> signUp()
        this.setState({
          steps: [...this.state.steps, 'Create Account'],
          activeStep: 2,
          showUsername: true
        })
        this.handleUsername()
        return
      }

      // claimed -> signIn()
      this.setState({
        account,
        activeStep: 2,
        username: account.username
      })
      this.signIn()
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(ERROR_MSG, true)
      this.onDisconnect()
    }
  }

  handleWhitelist = async () => {
    if (!this.state.address || !this.state.email) {
      this.handleSnackbarOpen(ERROR_MSG, true)
      return
    }

    try {
      this.setState({ EthIsLoading: true })
      await axios.post(`${BACKEND_API}/accounts/application/eth`, {
        email: this.state.email,
        address: this.state.address,
        signature: this.state.signature
      })
      this.setState({
        EthIsLoading: false,
        showWhitelist: false,
        snackbar: {
          error: false
        }
      })
      this.logEthWhitelist()

      this.handleSnackbarOpen(EMAIL_MSG, false)
      this.onDisconnect()
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(ERROR_MSG, true)
    }
  }

  handleUsername = async () => {
    if (this.state.username) {
      this.signUp()
    }
  }

  signUp = async () => {
    const { history, dispatch, noRedirect } = this.props
    const { username } = this.state
    const rewards = localStorage.getItem('YUP_CLAIM_RWRDS')
    let validate
    try {
      // check if username valid
      validate = await axios.post(`${BACKEND_API}/accounts/validate/${this.state.username}`)
    } catch (err) {
      console.error(err)
      this.handleSnackbarOpen(VALIDATE_MSG, true)
    }

    if (!validate) {
      this.handleSnackbarOpen(VALIDATE_MSG, true)
      return
    }

    if (validate.status === 200) {
      this.handleSnackbarOpen(MIRROR_MSG, false)
      this.setState({ EthIsLoading: true })
      const mirrorStatus = await axios.post(`${BACKEND_API}/accounts/eth/mirror`, { signature: this.state.signature, address: this.state.address, username: this.state.username })
      this.setState({ EthIsLoading: false })

      if (mirrorStatus.status === 200) {
        this.handleSnackbarOpen(REDIRECT_MSG, false)
        localStorage.setItem('YUP_ETH_AUTH', JSON.stringify({
          address: this.state.address,
          signature: this.state.signature,
          ...mirrorStatus.data
        }))

        const ethAuthInfo = { address: this.state.address,
          signature: this.state.signature,
          account: mirrorStatus.data.account
        }
        dispatch(updateEthAuthInfo(ethAuthInfo))

        this.logEthSignup(mirrorStatus.data.account)
        const profileUrl = `/${username}${rewards ? `?rewards=${rewards}` : ''}`
        if (window.location.href.split('/').pop() === username || noRedirect) {
          window.location.reload()
        } else {
          history.push(profileUrl)
        }
        this.props.handleDialogClose()
      } else {
        this.handleSnackbarOpen(ERROR_MSG, true)
      }
    } else {
      this.handleSnackbarOpen(VALIDATE_MSG, true)
    }
  }

  signIn = async () => {
    const { history, dispatch, noRedirect } = this.props
    let txStatus
    try {
      txStatus = await axios.post(`${BACKEND_API}/v1/eth/challenge/verify`, { address: this.state.address, signature: this.state.signature })
    } catch (err) {
      // TODO: error handling
      this.handleSnackbarOpen(ERROR_MSG, true)
      return
    }
    if (!txStatus) {
      return
    }
    this.handleSnackbarOpen(REDIRECT_MSG, false)

    const { address, account, signature } = this.state
    const ethAuthUpdate = { address, account, signature }
    dispatch(updateEthAuthInfo(ethAuthUpdate))

    this.logEthLogin(account)

    const profileUrl = `/${account.username}`
    // already on user page
    if (window.location.href.split('/').pop() === account.username || noRedirect) {
      window.location.reload()
    } else {
      history.push(profileUrl)
    }
    this.props.handleDialogClose()
  }

  onDisconnect = () => {
    this.setState({
      connected: false,
      address: '',
      steps: ['Connect Ethereum Account', 'Verify Ownership'],
      activeStep: 0,
      showWhitelist: false,
      showUsername: false,
      EthIsLoading: false
    },
    localStorage.removeItem('YUP_ETH_AUTH')
    )
  }

  handleMobileSignup = async () => {
    try {
      if (!EMAIL_RE.test(this.state.email)) {
        this.handleSnackbarOpen(INVALID_EMAIL_ERROR_MSG, true)
        return
      }
      await axios.post(`${BACKEND_API}/auth/invite_mobile`, { email: this.state.email })
      this.logSignupAttempt('email', this.state.email)
    } catch (err) {
      this.handleSnackbarOpen(ERROR_MSG, true)
    }
    this.handleSnackbarOpen(EMAIL_MSG, false)
    this.props.handleDialogClose()
  }

  startTwitterOAuth = async () => {
    try {
      this.setState({ OAuthIsLoading: true })
      const oauthRes = (await axios.post(`${BACKEND_API}/v1/auth/oauth-challenge`, { domain: 'yup.io' }))
      const { token, _id: id } = oauthRes.data
      const twitterRes = (await axios.post(`${BACKEND_API}/v1/auth/twitter`,
        { verificationToken: token, verificationId: id, oauthReferrer: 'website' }))
      this.logSignupAttempt('twitter', id)
      window.location.href = twitterRes.data.redirectPath
      this.setState({ OAuthIsLoading: false })
    } catch (err) {
      this.handleSnackbarOpen('Error occured during Twitter OAuth', true)
      console.error('Error occured during Twitter OAuth: ', err)
    }
  }

  logEthLogin (account) {
    if (window.analytics) {
      window.analytics.track('ETH Login', {
        userId: this.state.address,
        username: account.username,
        application: 'Web App'
      })
    }
  }

  logEthWhitelist () {
    if (window.analytics) {
      window.analytics.track('ETH Application Submission', {
        userId: this.state.address,
        email: this.state.email,
        application: 'Web App'
      })
    }
  }

  logEthSignup () {
    const ethAccount = {
      userId: this.state.address,
      username: this.state.username
    }

    if (window.analytics) {
      window.analytics.track('ETH Signup', {
        userId: ethAccount.userId,
        username: ethAccount.username,
        application: 'Web App'
      })
    }
    this.logSignupAttempt('eth', ethAccount)
  }

  logSignupAttempt (type, account) {
    if (window.analytics) {
      window.analytics.track('Attempt Signup', {
        userId: account,
        application: 'Web App',
        type
      })
    }
  }

  handleSnackbarOpen = (msg, error) => {
    this.setState({
      snackbar: {
        open: true,
        content: msg,
        error: error
      }
    })
  }

  handleSnackbarClose = () => {
    this.setState({
      snackbar: {
        open: false,
        content: '',
        error: this.state.snackbar.error
      }
    })
  }

  render () {
    const { handleDialogClose, dialogOpen, classes } = this.props
    const rewards = localStorage.getItem('YUP_CLAIM_RWRDS')

    if (rewards !== null && dialogOpen) {
      this.initWalletConnect()
    }
    return (
      <ErrorBoundary>
        <Portal>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={4000}
            className={classes.snackUpper}
            onClose={this.handleSnackbarClose}
            open={this.state.snackbar.open}
          >
            <SnackbarContent
              className={classes.snack}
              message={this.state.snackbar.content}
              style={{ backgroundColor: this.state.snackbar.error ? '#ff5252' : '#48B04C' }}
            />
          </Snackbar>
        </Portal>

        <YupDialog
          buttonPosition='right'
          headLine='Sign Up / Login'
          open={dialogOpen}
          onClose={() => {
            handleDialogClose()
            this.setState({ walletConnectOpen: false })
          }}
          aria-labelledby='scroll-dialog-title'
        >
          {!this.state.connected && (!this.state.showWhitelist && !this.state.showUsername) &&
            <>
                <DialogContentText>
                  <Typography
                    align='left'
                    variant='subtitle1'
                  >
                    <span className={classes.desktop}>
                      Earn money & clout for rating content anywhere on the internet. Get extra rewards for joining today.
                    </span>
                  </Typography>
                </DialogContentText>
                <Grid container
                  direction='column'
                  spacing={1}
                >
                  <Grid item>
                    <YupButton
                      fullWidth
                      size='large'
                      variant='outlined'
                      onClick={this.initWalletConnect}
                    >
                      <Typography
                        align='left'
                        className={classes.platforms}
                      >
                        WalletConnect
                      </Typography>
                      {this.state.EthIsLoading
                        ? <CircularProgress size={13.5}
                          className={classes.loader}
                        />
                        : <img alt='wallet connect'
                          src='/images/icons/wallet_connect.png'
                          className={classes.walletConnectIcon}
                        />
                      }
                    </YupButton>
                  </Grid>
                  <Grid item>
                    <YupButton
                      fullWidth
                      size='large'
                      variant='outlined'
                      onClick={this.startTwitterOAuth}
                    >
                      <Typography
                        align='left'
                        className={classes.platforms}
                      >
                        Twitter
                      </Typography>
                      {this.state.OAuthIsLoading
                        ? <CircularProgress size={13.5}
                          className={classes.loader}
                        />
                        : <img alt='twitter'
                          src='/images/icons/twitter.svg'
                          className={classes.twitterIcon}
                        />
                      }
                    </YupButton>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <YupInput
                        onKeyPress={(ev) => {
                          if (ev.key === 'Enter') {
                            this.handleMobileSignup()
                            ev.preventDefault()
                          }
                        }}
                        helperText={EMAIL_RE.test(this.state.email) || !this.state.email.length ? '' : 'Please enter a valid email'}
                        id='outlined-basic'
                        fullWidth
                        endAdornment={<InputAdornment position='end'
                          onClick={this.handleMobileSignup}
                        >
                          <Icon fontSize='small'
                            className='fal fa-arrow-right'
                            style={{ marginRight: '20px', cursor: 'pointer' }}
                          /></InputAdornment>}
                        aria-describedby='filled-weight-helper-text'
                        variant='outlined'
                        placeholder='Email'
                        type='email'
                        required
                        margin='dense'
                        error={!EMAIL_RE.test(this.state.email) && this.state.email.length}
                        onChange={this.handleEmailChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

            </>
          }

          {this.state.connected &&
            <>
                <DialogContentText>Please sign up with an 'active' wallet, one that has held some ETH or YUP before. Fresh unused wallets will not be whitelisted and will need to be approved </DialogContentText>
                <Stepper activeStep={this.state.activeStep}
                  orientation='vertical'
                  className={classes.stepper}
                >
                  {this.state.steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                      <StepContent>
                        <Typography
                          align='left'
                          variant='body1'
                        >
                          {this.getStepContent(this.state.activeStep)}
                        </Typography>
                        {this.state.showWhitelist && !this.state.showUsername &&
                          <DialogContent>
                            <TextField
                              onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                  this.handleWhitelist()
                                  ev.preventDefault()
                                }
                              }}
                              margin='dense'
                              id='outlined-basic'
                              variant='outlined'
                              placeholder='Email address'
                              required
                              type='text'
                              halfWidth
                              onChange={this.handleEmailChange}
                              InputProps={{
                                classes: {
                                  notchedOutline: classes.outline
                                },
                                className: classes.stepperInput,
                                endAdornment: (
                                  <YupButton
                                    onClick={this.handleWhitelist}
                                    style={{ width: 'auto' }}
                                  >
                                    {this.state.EthIsLoading
                                      ? <CircularProgress size={13.5}
                                        className={classes.loader}
                                      />
                                      : <KeyboardArrowRightIcon alt='submit' />
                                    }
                                  </YupButton>
                                )
                              }}
                            />
                          </DialogContent>
                        }
                        {this.state.showUsername && !this.state.showWhitelist &&
                          <DialogContent>
                            <TextField
                              onKeyPress={(ev) => {
                                if (ev.key === 'Enter') {
                                  this.handleUsername()
                                  ev.preventDefault()
                                }
                              }}
                              margin='dense'
                              id='outlined-basic'
                              variant='outlined'
                              placeholder='Username'
                              required
                              type='text'
                              fullWidth
                              onChange={this.handleUsernameChange}
                              InputProps={{ classes: { notchedOutline: classes.outline },
                                className: classes.stepperInput,
                                endAdornment: (
                                  <YupButton
                                    className={classes.button}
                                    onClick={this.handleUsername}
                                    style={{ width: 'auto' }}
                                  >
                                    {this.state.EthIsLoading
                                      ? <CircularProgress size={13.5} />
                                      : <KeyboardArrowRightIcon alt='submit' />
                                    }
                                  </YupButton>
                                )
                              }}
                            />
                          </DialogContent>
                        }
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
            </>
          }
        </YupDialog>
      </ErrorBoundary>
    )
  }
}

SubscribeDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  noRedirect: PropTypes.bool
}
export default memo(withRouter(connect(null)(withStyles(styles)(SubscribeDialog))))
