import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Portal, Snackbar, SnackbarContent, DialogTitle, DialogContent, DialogContentText, Button, Typography, CircularProgress, Stepper, Step, StepLabel, StepContent, Grid } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { getConnector } from '../../utils/eth'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import { convertUtf8ToHex } from '@walletconnect/utils'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { fetchSocialLevel } from '../../redux/actions'

const { BACKEND_API, POLY_CHAIN_ID } = process.env
const ERROR_MSG = `Make sure you are logged into yup and please try again.`
const NOT_POLYGON_MSG = 'Make sure you are connecting to Polygon from your wallet.'

const styles = theme => ({
  dialog: {
      width: '100%'
  },
  dialogTitleText: {
    fontWeight: '500'
  },
  dialogContentText: {
    fontWeight: '200'
  },
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
  },
  inputText: {
    fontSize: '16px',
    padding: '0px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '200',
    color: theme.palette.common.first,
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px'
    }
  }
})

class ConnectEth extends Component {
  state = {
    ethIsLoading: false,
    account: null,
    connector: null,
    connected: false,
    showWhitelist: false,
    showUsername: false,
    steps: ['Connect Ethereum Account', 'Verify Ownership'],
    activeStep: 0,
    snackbar: {
      open: false,
      error: true,
      content: ''
    },
    walletConnectOpen: false
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
    // create new connector
    const connector = await getConnector()
    this.setState({ connector })

    // already logged in
    if (connector.connected && !localStorage.getItem('YUP_ETH_AUTH')) {
      localStorage.removeItem('walletconnect')
      this.initWalletConnect()
    }

    if (!connector.connected) {
     await connector.createSession()
    }

    await this.subscribeToEvents()
  }

   subscribeToEvents = async () => {
    const { connector } = this.state

    if (!connector) { return }

    connector.on('connect', (error, payload) => {
      if (error) {
        this.handleSnackbarOpen(ERROR_MSG, true)
        throw error
      }

      this.onConnect(payload, false)
    })

    connector.on('disconnect', (error, payload) => {
      if (error) {
        this.handleSnackbarOpen(ERROR_MSG, true)
        throw error
      }

      this.onDisconnect()
      this.handleSnackbarOpen('Wallet disconnected.', true)
    })

    // already connected
    if (connector.connected) {
      this.setState({ connector })
      this.onConnect(connector, true)
    }
  };

   onConnect = async (payload, connected) => {
     if (!this.state.connector || !payload) { return }

     try {
      const chainId = connected ? payload._chainId : payload.params[0].chainId
      const accounts = connected ? payload._accounts : payload.params[0].accounts
      const eosname = this.props.account.name

      if (chainId !== Number(POLY_CHAIN_ID)) {
        this.handleSnackbarOpen(NOT_POLYGON_MSG, true)
        this.onDisconnect()
        return
      }

      this.handleSnackbarOpen('Successfully connected.', false)
      this.setState({
        connected: true,
        activeStep: 1
      })
      console.log('before before')

      const address = accounts[0]
      const { data: challenge } = (await axios.get(`${BACKEND_API}/v1/eth/challenge`, { params: { address } })).data
      console.log('challenge', challenge)
      const hexMsg = convertUtf8ToHex(challenge)
      console.log('hexMsg', hexMsg)
      const msgParams = [address, hexMsg]
      const signature = await this.state.connector.signMessage(msgParams)
      console.log('signature', signature)
      this.setState({ activeStep: 2 })
      console.log('before')
      await axios.post(`${BACKEND_API}/accounts/linked/eth`, { authType: 'ETH', address, eosname, signature })
      this.props.dispatch(fetchSocialLevel(eosname))
      console.log('0')
      this.handleSnackbarOpen('Successfully linked ETH account.', false)
      console.log('1')
      console.log(this.props.handleDialogClose)
      this.props.handleDialogClose()
      console.log('2')

      this.props.getBalances && this.props.getBalances(accounts[0]) // get balance for account if getBalance function is pased down
      this.props.setConnector && this.props.setConnector(this.state.connector) // set connector for account if setConnector function is pased down
      this.setState({ walletConnectOpen: false })
      } catch (err) {
        this.handleSnackbarOpen(err.msg, true)
        this.onDisconnect()
      }
  }

  onDisconnect = async () => {
    this.setState({
      connected: false,
      connector: null,
      steps: ['Connect Ethereum Account', 'Verify Ownership'],
      activeStep: 0,
      showWhitelist: false,
      showUsername: false,
      ethIsLoading: false
    },
    localStorage.removeItem('YUP_ETH_AUTH')
    )
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
    const { handleDialogClose, dialogOpen, classes, account } = this.props
    if (account && !this.state.account) this.setState({ account: account })
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

        <Dialog open={dialogOpen}
          onClose={() => {
            handleDialogClose()
            this.setState({ walletConnectOpen: false })
          }}
          aria-labelledby='form-dialog-title'
          className={classes.dialog}
        >
          {!this.state.connected && (!this.state.showWhitelist && !this.state.showUsername) &&
            <>
              <DialogTitle style={{ paddingBottom: '10px' }}>
                <Typography
                  align='left'
                  className={classes.dialogTitleText}
                  variant='h3'
                >
                  Link your Ethereum account
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Grid container
                  direction='column'
                  spacing={1}
                >
                  <Grid item>
                    <Button
                      variant='outlined'
                      size='large'
                      onClick={this.initWalletConnect}
                      fullWidth
                    >
                      <Typography
                        align='left'
                        className={classes.platforms}
                      >
                        WalletConnect
                      </Typography>
                      {this.state.ethIsLoading
                    ? <CircularProgress size={13.5}
                      className={classes.loader}
                      />
                    : <img alt='wallet connect'
                      src='/images/icons/wallet_connect.png'
                      className={classes.walletConnectIcon}
                      />
                  }
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          }

          {this.state.connected &&
            <>
              <DialogTitle style={{ paddingBottom: '10px' }}>
                <Typography
                  align='left'
                  className={classes.dialogTitleText}
                  variant='h5'
                >
                  Sign Up / Login
                </Typography>
              </DialogTitle>
              <DialogContent>
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
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </DialogContent>
            </>
          }
        </Dialog>
      </ErrorBoundary>
    )
  }
}

ConnectEth.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  getBalances: PropTypes.func,
  setConnector: PropTypes.func,
  dispatch: PropTypes.func.isRequired
}
export default memo(withRouter(connect(null)(withStyles(styles)(ConnectEth))))
