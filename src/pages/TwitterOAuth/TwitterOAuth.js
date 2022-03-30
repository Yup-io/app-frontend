import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import DotSpinner from '../../components/DotSpinner/DotSpinner'

const styles = (theme) => ({
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 0,
    paddingBottom: '20px'
  },
  page: {
    flex: 1,
    background: 'transparent',
    width: '100%',
    objectFit: 'cover',
    margin: '0px 0px 0px 0px'
  },
  gridContainer: {
    paddingTop: theme.spacing(6),
    [theme.breakpoints.down('lg')]: {
      paddingTop: theme.spacing(10)
    },
    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(10)
    }
  },
  messageFailure: {
    paddingTop: '5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.7vh',
    color: 'red'
  },
  messageLoad: {
    paddingTop: '5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '100',
    fontSize: '20px',
    color: 'white'
  }
})

const { BACKEND_API } = process.env

class TwitterOAuth extends Component {
  state = {
    isLoading: true,
    username: null,
    existingAcct: false,
    errorMessage: 'Failed to create your account'
  }

  componentDidMount () {
    this.createAccount()
  }

  createAccount = () => {
    (async () => {
      try {
        const { location } = this.props
        const pathname = location.pathname.split('/')
        const token = pathname.pop()
        if (pathname.pop() === 'redirect') {
          this.setState({ existingAcct: true })
        }
        const res = await axios.post(`${BACKEND_API}/accounts/twitter/mirror/create`, { token })

        const twitterInfo = { name: res.data.account.eosname, isMirror: true, seenTutorial: this.state.existingAcct, token: token, expiration: res.data.expiration }
        localStorage.setItem('twitterMirrorInfo', JSON.stringify(twitterInfo))
        this.setState({ isLoading: false, username: res.data.account.username })
        // reload because of unknown race condition
        setTimeout(() => {
          window.location.reload()
        }, 300)
      } catch (err) {
        if (err.toString().includes('Error: Request failed with status code 429')) {
          this.setState({ errorMessage: 'Request failed. You have attempted to create too many accounts.' })
        }
        this.setState({ isLoading: false })
      }
    })()
  }

  render () {
    const { classes } = this.props
    const customRedirect = localStorage.getItem('twitterRedirect')
    const { isLoading, username, existingAcct, errorMessage } = this.state
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
        >
          <Grid container
            display='flex'
            direction='column'
            alignItems='center'
            justify='center'
          >
            <Grid item
              container
              alignItems='center'
              justify='center'
            >
              <DotSpinner />
            </Grid>
            <Grid item>
              { existingAcct
              ? <Typography
                className={classes.messageLoad}
                >
                Redirecting you to your account...
              </Typography>
              : <Typography
                className={classes.messageLoad}
                >
                Creating account...this may take a minute...
              </Typography>
            }
            </Grid>
          </Grid>
        </div>
      )
    }

    if (username !== null) {
      return <Redirect to={`/${customRedirect || username}`} />
    }

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <div className={classes.page}>
            <Grid alignItems='flex-start'
              className={classes.gridContainer}
              container
              justify='center'
            >
              <Typography
                className={classes.messageFailure}
                constiant='h1'
              >
                {errorMessage}
              </Typography>
            </Grid>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

TwitterOAuth.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withStyles(styles)(TwitterOAuth)
