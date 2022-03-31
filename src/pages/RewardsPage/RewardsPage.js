import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography, Card, Button, Snackbar, SnackbarContent } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { Helmet } from 'react-helmet'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Colors from '../../utils/colors'
import YupInput from '../../components/Miscellaneous/YupInput'
import SubscribeDialog from '../../components/SubscribeDialog/SubscribeDialog'
import axios from 'axios'
import CountUp from 'react-countup'

const { BACKEND_API, REWARDS_MANAGER_API } = process.env
const CLAIM_IMG = 'https://app-meta-images.s3.amazonaws.com/claim-creator-rewards-thumbnail.jpeg'

const styles = theme => ({
  container: {
    minHeight: '100vh',
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    backgroundColor: theme.palette.alt.second
  },
  btn: {
    backgroundColor: '#00E08E',
    fontFamily: 'Gilroy',
    width: 380,
    height: '45px',
    borderRadius: '0.65rem',
    marginTop: 15,
    color: '#fff',
    '&:hover': {
      backgroundColor: '#00E08E'
    }
  },
  page: {
    width: '100%',
    marginLeft: 0,
    overflowX: 'hidden',
    flex: 1
  },
  card: {
    padding: theme.spacing(2),
    height: '70%',
    width: 380,
    marginBottom: 0,
    boxShadow:
      `0px 0px 30px 0px ${theme.palette.shadow.first}44, 0px 0px 0.75px  ${theme.palette.shadow.first}66`,
    backgroundColor: theme.palette.alt.second,
    [theme.breakpoints.down('xs')]: {
      marginBottom: '20vh',
      width: '90%'
    }
  },
  Skeleton: {
    background: `linear-gradient(90deg, ${Colors.Green}33, ${Colors.Moss}33, ${Colors.Yellow}33, ${Colors.Orange}33,  ${Colors.Red}33)`
  }
})

class RewardsPage extends Component {
  state = {
    isLoading: false,
    ethAddress: this.props.location.pathname.split('/')[2] || '',
    rewards: null,
    price: null,
    dialogOpen: false,
    snackbarMsg: null
  }

  handleInput = e => {
    this.setState({ ethAddress: (e.target.value).toLowerCase() })
  }

  componentDidMount = () => {
    const ethAddress = this.props.location.pathname.split('/')[2]
    if (ethAddress) {
      this.setState({ ethAddress }, () => { this.fetchCreatorRewards() })
      this.ethInput = ethAddress
    }
    axios.get(`${REWARDS_MANAGER_API}/prices/yupeth`).then(({ data }) => this.setState({ price: data.YUPETH }))
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.history.push(`/rewards/${this.state.ethAddress}`)
    this.setState({ isLoading: true })
    this.fetchCreatorRewards()
  }
   handleSnackbarClose = () => this.setState({ snackbarMsg: '' })

  fetchCreatorRewards = async () => {
    try {
      const rewards = (await (axios.get(`${BACKEND_API}/rewards/eth/${this.state.ethAddress}`))).data.creatorRewards
      localStorage.setItem('YUP_CLAIM_RWRDS', rewards)
      this.setState({ rewards })
    } catch (err) {
      if (err.response && err.response.status === 422) {
        this.setState({ snackbarMsg: 'Please enter a valid ethereum address' })
      }
    }
    this.setState({ isLoading: false })
  }
  openWalletConnectDialog = () => this.setState({ dialogOpen: true })
  handleDialogClose = () => this.setState({ dialogOpen: false })

  render () {
    const { classes } = this.props
    const { isLoading, rewards, price, dialogOpen, snackbarMsg, ethAddress } = this.state
    const metaDescription = ethAddress ? `${ethAddress.slice(0, 5)}...${ethAddress.slice(-6, -1)} has earned ${Math.round(rewards)} $YUP in creator rewards`
    : `Check your ETH address and claim your rewards`
    const metaTitle = 'yup NFT Creator Rewards'
    return (
      <ErrorBoundary>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Rewards</title>
          <meta property='description'
            content={metaDescription}
          />
          <meta property='image'
            content={CLAIM_IMG}
          />
          <meta name='twitter:card'
            content='summary_large_image'
          />
          <meta
            name='twitter:title'
            content={metaTitle}
          />
          <meta name='twitter:site'
            content='@yup_io'
          />
          <meta
            name='twitter:description'
            content={metaDescription}
          />
          <meta
            name='twitter:image'
            content={CLAIM_IMG}
          />
          <meta
            property='og:title'
            content={metaTitle}
          />
          <meta
            property='og:description'
            content={metaDescription}
          />
          <meta property='og:image'
            content={CLAIM_IMG}
          />
        </Helmet>
        <div className={classes.container}>
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
              style={{ background: 'transparent', boxShadow: 'none', padding: '16px 4px' }}
            >
              <Grid container
                justify='space-between'
                alignItems='center'
                direction='row'
                spacing={3}
              >
                <Grid item>
                  <Typography
                    variant='h4'
                  >
                    Check Rewards Eligibility
                  </Typography>
                </Grid>
                <Grid item
                  xs={12}
                >
                  <form onSubmit={this.onSubmit}>
                    <YupInput
                      fullWidth
                      id='address'
                      maxLength={50}
                      label={'ETH address'}
                      type='text'
                      value={this.state.ethAddress}
                      variant='outlined'
                      onChange={this.handleInput}
                    /></form>
                </Grid>
              </Grid>
            </Card>
            <Card className={classes.card}
              style={{ display: rewards !== null || isLoading ? 'inherit' : 'none' }}
              elevation={0}
            >
              <Grid container
                direction='row'
              >
                <Grid
                  item
                  container
                  justifyContent='center'
                  alignItems='center'
                  direction='row'
                >
                  <Typography variant='h2'
                    style={{ color: '#00E08E' }}
                  >
                    { isLoading
                    ? <Skeleton
                        animation='pulse'
                        className={classes.Skeleton}
                        style={{ transform: 'none' }}
                      >&nbsp;&nbsp;&nbsp;&nbsp;</Skeleton>
                      : <CountUp
                          end={rewards}
                          decimals={2}
                          start={0}
                          duration={1}
                          suffix=' YUP'
                        /> }
                  </Typography>
                  <Typography variant='h4'
                    style={{ opacity: 0.5, marginLeft: 20 }}
                  >
                    ~{(price * rewards).toFixed(2)} USD
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            {rewards !== null && (
              <>
                <Button
                  fullWidth
                  className={classes.btn}
                  onClick={this.openWalletConnectDialog}
                  variant='contained'
                >
                  Claim
                </Button>
                <SubscribeDialog
                  dialogOpen={dialogOpen}
                  handleDialogClose={this.handleDialogClose}
                />
              </>
            )}
          </Grid>
        </div>
      </ErrorBoundary>
    )
  }
}

RewardsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withStyles(styles)(RewardsPage)
