import React, { Component } from 'react'
import {
  DialogContent,
  DialogContentText,
  createTheme,
  CssBaseline
} from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { theme, lightPalette, darkPalette } from '../utils/theme.js'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { reactReduxContext } from '../utils/history'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import wallet from '../eos/scatter/scatter.wallet'
import { loginScatter, signalConnection, setListOptions, updateEthAuthInfo, fetchUserCollections, fetchUserPermissions, fetchAuthInfo, toggleColorTheme } from '../redux/actions'
import { accountInfoSelector } from '../redux/selectors'
import axios from 'axios'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import DotSpinner from '../components/DotSpinner/DotSpinner'
import Search from './Search/Search'
import { StyledIndexPaper } from './StyledIndexPaper'
// import SiteBanner from '../components/SiteBanner/SiteBanner'

import YupLists from './YupLists/YupLists'
import Discover from './Discover/Discover'
import User from './User/User'
import PostPage from './PostPage/PostPage'
import ScorePage from './ScorePage/ScorePage'
import RewardsPage from './RewardsPage/RewardsPage'
import MigrationPage from './MigrationPage/MigrationPage'
import TwitterOAuth from './TwitterOAuth/TwitterOAuth'
import Collections from './Collections/Collections'
import Analytics from './Analytics/Analytics'
import StakingPage from './StakingPage/Staking'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import YupDialog from '../components/Miscellaneous/YupDialog.js'

const { BACKEND_API } = process.env

const pathname = document.location.pathname
const isProtectedRoute = (pathname !== '/leaderboard' && pathname !== '/analytics')

class Index extends Component {
  state = {
    alertDialogOpen: false,
    isLoading: isProtectedRoute // all protected routes require wallet to load first
  }

  state = {}
  handleAlertDialogOpen = (msg) => {
    this.setState({ alertDialogOpen: true, alertDialogContent: msg })
  }

  handleAlertDialogClose = () => {
    this.setState({ alertDialogOpen: false, alertDialogContent: '' })
  }

  async fetchListOptions () {
    const { setListOpts } = this.props
    const updatedListOpts = (await axios.get(`${BACKEND_API}/v1/lists/listInfo`)).data
    setListOpts(updatedListOpts)
  }

  async checkEthAuth () {
    try {
      const { updateEthAuth } = this.props
      const ethAuthInfo = localStorage.getItem('YUP_ETH_AUTH')

      if (!ethAuthInfo) { return }

      const { address, signature } = JSON.parse(ethAuthInfo)
      await axios.post(`${BACKEND_API}/v1/eth/challenge/verify`, { address, signature }) // Will throw if challenge is invalid

      const account = (await axios.get(`${BACKEND_API}/accounts/eth?address=${address}`)).data
      const ethAuthUpdate = { address, signature, account }
      updateEthAuth(ethAuthUpdate)
    } catch (err) {}
  }

  async checkTwitterAuth () {
    try {
      const twitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
      if (!twitterMirrorInfo) { return }
      const { expiration } = JSON.parse(twitterMirrorInfo)
      if (expiration <= Date.now()) { // if twitter oauth token expired, sign user out
        localStorage.removeItem('twitterMirrorInfo')
      }
    } catch (err) {}
  }
  async setThemePreference () {
    try {
      const { toggleTheme } = this.props
      const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      const lightMode = JSON.parse(localStorage.getItem('lightMode'))
      if (lightMode || (userPrefersLight && lightMode === null)) { toggleTheme() }
    } catch (err) {}
  }

  componentDidMount () {
    (async () => {
      const { getLoggedUserCollections, fetchUserPerms, checkScatter, scatterInstall, accountName, fetchAuthFromState } = this.props
      wallet.detect(checkScatter, scatterInstall)
      this.checkEthAuth()
      this.checkTwitterAuth()
      this.setThemePreference()

      fetchAuthFromState(accountName)

      if (pathname.startsWith('/leaderboard') || pathname.startsWith('/lists')) {
        await this.fetchListOptions()
      }
      this.setState({ isLoading: false })

      if (accountName) {
        getLoggedUserCollections(accountName)
        fetchUserPerms(accountName)
      }
    })()
  }

  componentDidUpdate (prevProps) {
    const { getLoggedUserCollections, fetchUserPerms, fetchAuthFromState, accountName } = this.props
    if (accountName && prevProps.accountName !== accountName) {
      fetchAuthFromState(accountName)
      getLoggedUserCollections(accountName)
      fetchUserPerms(accountName)
    }
  }

  render () {
    const { history, lightMode, tour } = this.props
    if (this.state.isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
        >
          <DotSpinner />
        </div>
      )
    }

    const metaTitle = 'Yup • Social Network for Curators in Web3'
    const activePalette = lightMode ? lightPalette : darkPalette
    const themeWithPalette = createTheme({ ...theme(activePalette), ...activePalette })
    console.log(themeWithPalette)
    // const hideSiteBanner = pathname.startsWith('/staking') || pathname.startsWith('/migration') || localStorage.getItem('bannerClosed')
    return <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themeWithPalette}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <StyledIndexPaper>
            <Helmet>
              <meta charSet='utf-8' />
              <title> {metaTitle} </title>
              <meta name='description'
                content={metaTitle}
              />
            </Helmet>
            <ConnectedRouter history={history}
              context={reactReduxContext}
            >
              <div>
                <Header isTourOpen={tour} />
                <Switch>
                  <Route component={Discover}
                    exact
                    path='/'
                  />
                  <Route component={YupLists}
                    path='/leaderboard'
                  />
                  <Route component={Search}
                    path='/search'
                  />
                  <Route component={TwitterOAuth}
                    path='/twitter/:userid'
                  />
                  <Route component={PostPage}
                    exact
                    path='/p/:postid'
                  />
                  <Route component={ScorePage}
                    exact
                    path='/s'
                  />
                  <Route component={RewardsPage}
                    path='/rewards'
                  />
                  <Route component={MigrationPage}
                    path='/migration'
                  />
                  <Route component={Analytics}
                    exact
                    path='/:username/analytics'
                  />
                  <Route component={StakingPage}
                    exact
                    path='/staking'
                  />
                  <Route component={Collections}
                    exact
                    path='/collections/:name/:id'
                  />
                  <Route component={User}
                    exact
                    path='/:username'
                  />
                  <Redirect from='*'
                    to='/'
                  />
                  <Redirect from='/lists'
                    to='/leaderboard'
                  />
                </Switch>
                <Footer />
              </div>
            </ConnectedRouter>
          </StyledIndexPaper>
          <YupDialog
            aria-describedby='alert-dialog-description'
            aria-labelledby='alert-dialog-title'
            onClose={this.handleAlertDialogClose}
            open={this.state.alertDialogOpen}
          >
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {this.state.alertDialogContent}
              </DialogContentText>
            </DialogContent>
          </YupDialog>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  }
}

Index.propTypes = {
  checkScatter: PropTypes.func.isRequired,
  setListOpts: PropTypes.func.isRequired,
  scatterInstall: PropTypes.func.isRequired,
  updateEthAuth: PropTypes.func.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  getLoggedUserCollections: PropTypes.func.isRequired,
  accountName: PropTypes.string,
  history: PropTypes.object,
  fetchUserPerms: PropTypes.func.isRequired,
  fetchAuthFromState: PropTypes.func.isRequired,
  lightMode: PropTypes.bool.isRequired,
  tour: PropTypes.bool
}

const mapActionToProps = (dispatch) => {
  return {
    checkScatter: (scatter, account, eos) => dispatch(loginScatter(scatter, account, eos)),
    scatterInstall: (bool) => dispatch(signalConnection(bool)),
    setListOpts: (listOpts) => dispatch(setListOptions(listOpts)),
    updateEthAuth: (ethAuthInfo) => dispatch(updateEthAuthInfo(ethAuthInfo)),
    fetchUserPerms: (accountName) => dispatch(fetchUserPermissions(accountName)),
    getLoggedUserCollections: (accountName) => dispatch(fetchUserCollections(accountName)),
    fetchAuthFromState: (accountName) => dispatch(fetchAuthInfo(accountName)),
    toggleTheme: () => dispatch(toggleColorTheme())
  }
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return {
    accountName: account && account.name ? account.name : null,
    lightMode: state.lightMode.active,
    tour: state.tour.isTourOpen
  }
}

export default connect(mapStateToProps, mapActionToProps)(Index)
