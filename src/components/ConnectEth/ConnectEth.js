import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { Dialog, Portal, Snackbar, SnackbarContent, DialogTitle, DialogContent, DialogContentText, Button, Typography, CircularProgress, Stepper, Step, StepLabel, StepContent, Grid } from '@mui/material'
import withStyles from '@mui/styles/withStyles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { convertUtf8ToHex } from '@walletconnect/utils'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { fetchSocialLevel } from '../../redux/actions'
import {
  getPolygonWeb3Modal,
  getPolygonProvider,
  getConnector,
  getWeb3InstanceOfProvider
} from '../../utils/eth'

import { polygonConfig } from '../../config'
import { apiGetChallenge, apiSetETHAddress } from '../../apis'

const ERROR_MSG = `Make sure you are logged into yup and please try again.`
const NOT_POLYGON_MSG = 'Make sure you are connecting to Polygon from your wallet. You can use Metamask mobile.'

const styles = theme => ({
  dialog: {
    width: '100%',
    zIndex: 10
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
    [theme.breakpoints.down(undefined)]: {
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
    [theme.breakpoints.down('md')]: {
      width: '160px'
    }
  },
  inputText: {
    fontSize: '16px',
    padding: '0px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '200',
    color: theme.palette.common.first,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  }
})

// TODO: Move this logic into React hook.
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
    if (this.props.isProvider) {
      const provider = await getPolygonProvider(getPolygonWeb3Modal(this.props.backupRpc))
      this.props.setProvider(provider)
      if (provider) {
        await this.subscribeToEventsProvider(provider)
      }
    } else {
      const connector = await getConnector()
      this.setState({ connector })

      // already logged in
      if (connector.connected && !localStorage.getItem('YUP_ETH_AUTH')) {
        await connector.killSession()
        localStorage.removeItem('walletconnect')
        // Calling recursive?
        this.initWalletConnect()
      }

      if (!connector.connected) {
        await connector.createSession()
      }

      await this.subscribeToEvents(connector)
    }
  }

  handleConnect = async (chainId, accounts, signMethod) => {
    const { account: { name: eosname }, currentEthAddress } = this.props

    if (Number(chainId) !== polygonConfig.chainId) {
      this.handleSnackbarOpen(NOT_POLYGON_MSG, true)
      this.onDisconnect()
      return
    }

    this.setState({
      connected: true,
      activeStep: 1
    })

    const address = accounts[0]
    this.account = address
    this.setState({ activeStep: 2 })

    if (eosname) {
      if (!currentEthAddress) {
        // Update user's ETH address only if user's current ETH address is empty.
        const { data: challenge } = await apiGetChallenge({ address })
        const hexMsg = convertUtf8ToHex(challenge)
        const signature = await signMethod(hexMsg, address)

        await apiSetETHAddress({ authType: 'ETH', address, eosname, signature })
      }

      this.props.dispatch(fetchSocialLevel(eosname))
    }

    this.handleSnackbarOpen('Successfully linked ETH account.', false)
    this.updateParentSuccess()
    this.props.handleDialogClose()
    this.setState({ walletConnectOpen: false })
  }

  subscribeToEventsProvider = async (provider) => {
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
      const chainId = await web3.eth.getChainId()

      await this.handleConnect(chainId, accounts, (hexMsg, address) => web3.eth.personal.sign(hexMsg, address))
    } catch (err) {
      this.handleSnackbarOpen(err.msg, true)
      localStorage.removeItem('walletconnect')
      this.props.handleDisconnect && this.props.handleDisconnect()
      this.props.setConnector && this.props.setConnector(this.state.connector) // set connector for account if setConnector function is pased down
      this.onDisconnect()
    }
  }

   subscribeToEvents = async (connector) => {
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
   }

   onConnect = async (payload, connected) => {
     if (!this.state.connector || !payload) { return }

     try {
       const chainId = connected ? payload._chainId : payload.params[0].chainId
       const accounts = connected ? payload._accounts : payload.params[0].accounts

       await this.handleConnect(chainId, accounts, (hexMsg, address) => this.state.connector.signPersonalMessage([hexMsg, address]))
     } catch (err) {
       this.updateParentFail()
       this.handleSnackbarOpen(err.msg, true)
       localStorage.removeItem('walletconnect')
       this.onDisconnect()
     }
   }

  updateParentSuccess = () => {
    try {
      this.props.setAddress && this.props.setAddress(this.account) // set address for account if getBalance function is pased down
      this.props.getBalances && this.props.getBalances(this.account) // get balance for account if getBalance function is pased down
      this.props.setConnector && this.props.setConnector(this.state.connector) // set connector for account if setConnector function is pased down
    } catch {}
  }

  updateParentFail = () => {
    try {
      this.props.handleDisconnect && this.props.handleDisconnect()
      this.props.setConnector && this.props.setConnector(this.state.connector)
    } catch {}
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
                Sign Up / Login
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

const mapStateToProps = (state) => ({
  currentEthAddress: state.authInfo.address
})

ConnectEth.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  handleDialogClose: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  getBalances: PropTypes.func,
  backupRpc: PropTypes.string,
  handleDisconnect: PropTypes.func,
  setConnector: PropTypes.func,
  setAddress: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  isProvider: PropTypes.bool,
  setProvider: PropTypes.func,
  currentEthAddress: PropTypes.string
}
export default memo(withRouter(connect(mapStateToProps)(withStyles(styles)(ConnectEth))))
