import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import withStyles from '@mui/styles/withStyles'
import { Grid, Typography, Card, InputAdornment, Icon, Skeleton } from '@mui/material'
import { Helmet } from 'react-helmet'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import '../../components/Tour/tourstyles.css'
import isEqual from 'lodash/isEqual'
import { YupInput, YupButton } from '../../components/Miscellaneous'
import { Brand, Other } from '../../utils/colors'
import { PageBody } from '../pageLayouts'
import axios from 'axios'

const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    maxWidth: '100vw',
    overflowY: 'hidden',
    backgroundColor: theme.palette.M800
  },
  page: {
    flex: 1,
    width: '100%',
    marginLeft: 0,
    overflowX: 'hidden'
  },
  sideFeed: {
    position: 'fixed',
    marginLeft: '38vw',
    paddingLeft: 0,
    paddingRight: 0
  },
  Card: {
    padding: theme.spacing(2),
    height: '70%',
    width: '300px',
    marginBottom: 0,
    boxShadow:
      `0px 0px 30px 0px ${theme.palette.M900}44, 0px 0px 0.75px  ${theme.palette.M900}66`,
    backgroundColor: theme.palette.M800,
    [theme.breakpoints.down('md')]: {
      marginBottom: '20vh',
      width: '90%'
    }
  },
  Skeleton: {
    background: `linear-gradient(90deg, ${Brand.mint}33, ${Other.moss}33, ${Brand.yellow}33, ${Brand.orange}33,  ${Brand.red}33)`
  }
})

class ScorePage extends Component {
  state = {
    isTourOpen: false,
    isMinimize: false,
    showTour: true,
    isLoading: false,
    inputEntered: false,
    user: {},
    twitterHandle: null
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  handleScroll = e => {
    const { isMinimize } = this.state
    let element = e.target
    if (element.scrollTop > this.prev && !isMinimize) {
      this.setState({ isMinimize: true })
    }
    if (element.scrollTop === 0 && isMinimize) {
      this.setState({ isMinimize: false })
    }

    this.prev = element.scrollTop
  }
  handleInput = e => {
    this.setState({ twitterHandle: e.target.value })
  }
  onSubmit = e => {
    e.preventDefault()
    this.setState({ inputEntered: true, isLoading: true })
    this.getYupScore()
  }
  getYupScore = async () => {
    const user = (await axios.get(`${BACKEND_API}/scores/entity?twitterUsername=` + this.state.twitterHandle)).data
    this.setState({ inputEntered: true, isLoading: false, user: user })
  }

  render () {
    const { classes } = this.props
    const { isLoading, inputEntered, user, twitterHandle } = this.state

    const username = user.twitterUsername
    const YupScore = Math.round(user.score)
    const socialLevelColor = YupScore >= 80 && YupScore <= 1000 ? Brand.mint : YupScore >= 60 && YupScore <= 80 ? Other.moss : YupScore >= 40 && YupScore <= 60 ? Brand.yellow : YupScore >= 20 && YupScore <= 40 ? Brand.orange : Brand.red

    return (
      <ErrorBoundary>
        <Helmet>
          <meta charSet='utf-8' />
          <title>  </title>
          <meta property='description'
            content=''
          />
          <meta property='image'
            content=''
          />
          <meta name='twitter:card'
            content='summary_large_image'
          />
          <meta
            name='twitter:title'
            content=''
          />
          <meta name='twitter:site'
            content='@yup_io'
          />
          <meta
            name='twitter:description'
            content=''
          />
          <meta
            name='twitter:image'
            content=''
          />
          <meta
            property='og:title'
            content=''
          />
          <meta
            property='og:description'
            content=''
          />
          <meta property='og:image'
            content=''
          />
        </Helmet>
        <PageBody >
          <div className={classes.container}>
            <Grid
              container
              className={classes.page}
              direction='column'
              justifyContent='center'
              alignItems='center'
            >
              <Card className={classes.Card}
                elevation={0}
                style={{ background: 'transparent', boxShadow: 'none', padding: '16px 4px' }}
              >
                <Grid container
                  justifyContent='space-between'
                  alignItems='center'
                  direction='row'
                  spacing={3}
                >
                  <Grid item>
                    <Typography style={{ opacity: 0.3 }}
                      variant='h5'
                    >
                      Yup Score
                    </Typography>
                  </Grid>
                  <Grid item>
                    <YupButton
                      size='small'
                      content='text'
                      style={{ opacity: 0.2 }}
                    >Twitter</YupButton>
                  </Grid>

                  <Grid item
                    xs={12}
                  >
                    <form onSubmit={this.onSubmit}>
                      <YupInput
                        fullWidth
                        id='name'
                        maxLength={30}
                        label='Twitter Username...'
                        type='text'
                        variant='outlined'
                        onChange={this.handleInput}
                        endAdornment={<InputAdornment position='end'>
                          <Icon fontSize='small'
                            className='fal fa-arrow-right'
                            style={{ marginRight: '20px' }}
                          /></InputAdornment>}
                      /></form>
                  </Grid>
                </Grid>
              </Card>
              <Card className={classes.Card}
                style={{ display: inputEntered ? 'inherit' : 'none' }}
                elevation={0}
              >
                <Grid container
                  justifyContent='center'
                  direction='column'
                  spacing={2}
                >
                  <Grid
                    item
                    container
                    direction='column'
                    spacing={1}
                  >
                    <Grid
                      item
                    >
                      <Typography variant='h3'>
                        {(inputEntered && !isLoading) ? `@${username}` : `@${twitterHandle}`}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                    >
                      <Typography variant='body2'>
                        {inputEntered ? '' : 'Twitter'}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    direction='row'
                  >
                    <Typography variant='h1'
                      style={{
                        color: inputEntered ? socialLevelColor : 'inherit'
                      }}
                    >
                      { inputEntered ? isLoading
                        ? <Skeleton
                          animation='pulse'
                          className={classes.Skeleton}
                          style={{ transform: 'none' }}
                        >&nbsp;&nbsp;&nbsp;&nbsp;</Skeleton> : YupScore : '??' }
                    </Typography>
                    <Typography variant='h5'>
                      &nbsp;/100
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </div>
        </PageBody>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  const { router } = state
  return {
    feed: router.location.query.feed || state.homeFeed.feed,
    query: router.location.query
  }
}

ScorePage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default memo(connect(mapStateToProps)(withStyles(styles)(ScorePage)))
