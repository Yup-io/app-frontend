import React, { PureComponent } from 'react'
import { SnackbarContent, Snackbar, Dialog, DialogContent, DialogContentText } from '@material-ui/core'
import PropTypes from 'prop-types'
import TopBarAndDrawer from '../TopBarAndDrawer/TopBarAndDrawer'
import { connect } from 'react-redux'
import scatterWallet from '../../eos/scatter/scatter.wallet'
import { loginScatter, signalConnection } from '../../redux/actions/scatter.actions'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  root: {
    width: '100%'
  }
})

class Header extends PureComponent {
  state = {
    alertDialogOpen: false,
    snackbarMsg: ''
  }

  handleAlertDialogOpen = (msg) => {
    this.setState({ alertDialogOpen: true, alertDialogContent: msg })
  }

  handleAlertDialogClose = () => {
    this.setState({ alertDialogOpen: false, alertDialogContent: '' })
  }

  checkScatter = () => {
    (async () => {
      const { scatter, account, updateScatter, scatterInstall } = this.props
      if (scatter == null || account == null) {
        try {
          await scatterWallet.detect(updateScatter, scatterInstall)
        } catch (err) {
          if (err.message === 'TWO_SCATTERS_INSTALLED') {
            this.setState({
              alertDialogOpen: true,
              alertDialogContent: `Both Scatter Desktop and Extension are installed. Close or
              uninstall one to continue`
            })
          }
        }
      }
    })()
  }

  async checkBrave () {
    if (localStorage.getItem('CHECK_BRAVE')) return
    if (navigator.brave && await navigator.brave.isBrave()) {
      this.setState({
        snackbarMsg: `You may experience some performance issues on Brave, please turn shields off for the best experience.`
      })
      localStorage.setItem('CHECK_BRAVE', true)
    }
  }

  handleSnackbarOpen = snackbarMsg => {
    this.setState({ snackbarMsg })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarMsg: '' })
  }

  componentDidMount () {
    this.checkScatter()
    this.checkBrave()
  }

  render () {
    this.checkScatter()
    const { snackbarMsg } = this.state
    const { classes, isTourOpen } = this.props
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <TopBarAndDrawer
            isTourOpen={isTourOpen}
          />
          <Snackbar
            autoHideDuration={6000}
            onClose={this.handleSnackbarClose}
            open={!!snackbarMsg}
          >
            <SnackbarContent message={snackbarMsg} />
          </Snackbar>
          <Dialog
            aria-describedby='alert-dialog-description'
            aria-labelledby='alert-dialog-title'
            onClose={this.handleAlertDialogClose}
            open={this.state.alertDialogOpen}
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                { this.state.alertDialogContent }
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </div>
      </ErrorBoundary>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  scatter: PropTypes.object,
  scatterInstall: PropTypes.func.isRequired,
  updateScatter: PropTypes.func.isRequired,
  account: PropTypes.object,
  isTourOpen: PropTypes.bool
}

const mapStateToProps = (state) => {
  const account = accountInfoSelector(state)

  return {
    account,
    scatter: state.scatterRequest.scatter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    scatterInstall: (bool) => dispatch(signalConnection(bool)),
    updateScatter: (scatter, account) => dispatch(loginScatter(scatter, account))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header))
