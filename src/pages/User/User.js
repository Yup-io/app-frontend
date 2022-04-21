import React, { Component } from 'react'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll'
import FeedLoader from '../../components/FeedLoader/FeedLoader'
import withStyles from '@mui/styles/withStyles'
import withTheme from '@mui/styles/withTheme'
import { Fab, Typography, Grid, Button, IconButton, Fade, Tabs, Tab, Dialog, DialogTitle, DialogContent, Chip } from '@mui/material'
import axios from 'axios'
import { pushAccount, fetchFollowers, fetchFollowing } from '../../redux/actions'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import path from 'path'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import ReactPlayer from 'react-player'
import { Helmet } from 'react-helmet'
import AddIcon from '@mui/icons-material/Add'
import CollectionDialog from '../../components/Collections/CollectionDialog.js'
import { accountInfoSelector } from '../../redux/selectors'
import CreateCollectionFab from '../../components/Miscellaneous/CreateCollectionFab.js'
import CollectionItem from '../../components/Collections/CollectionItem.js'
import ShareTwitterDialog from '../../components/ShareTwitterDialog/ShareTwitterDialog.js'
import { Link } from 'react-router-dom'
import Img from 'react-image'
import rollbar from '../../utils/rollbar'

const { BACKEND_API, REWARDS_MANAGER_API, WEB_APP_URL } = process.env
const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'
const LIMIT_COLLECTIONS = 5
const showTabs = window.innerWidth <= 1300
const isMobile = window.innerWidth <= 600

const styles = theme => ({
  accountErrorHeader: {
    paddingTop: '15%',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.5rem',
    color: theme.palette.common.first
  },
  accountErrorSub: {
    paddingTop: '25px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '1rem',
    color: theme.palette.common.first
  },
  container: {
    height: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll'
  },
  dialogContent: {
    padding: '8px 0px'
  },
  feedPage: {
    marginLeft: '110px',
    [theme.breakpoints.down('xl')]: {
      marginLeft: '30px',
      maxWidth: '600px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      maxWidth: '96%'
    }
  },
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    minHeight: '800px',
    marginLeft: '110px',
    [theme.breakpoints.down('xl')]: {
      marginLeft: '30px',
      maxWidth: '550px'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      marginLeft: '15px'
    }
  },
  infiniteScroll: {
    width: '100vw'
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  page: {
    width: '100%',
    marginLeft: 100,
    [theme.breakpoints.down('sm')]: {
      backgroundSize: 'contain',
      paddingTop: theme.spacing(0),
      padding: '0px 1rem',
      marginLeft: 0
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0px 8vw'
    },
    [theme.breakpoints.up('xl')]: {
      padding: '0px 15vw 0px 15vw'
    },
    padding: '0px 6vw',
    flex: 1
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    zIndex: 1000,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  icons: {
    color: theme.palette.common.first
  },
  tabs: {
    color: theme.palette.common.first,
    fontSize: '1.2rem',
    marginLeft: '35px',
    textTransform: 'capitalize',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '15px'
    }
  },
  collections: {
    color: theme.palette.common.first,
    zIndex: '999',
    marginLeft: '20px',
    maxWidth: '25%',
    [theme.breakpoints.down('xl')]: {
      margin: '0px 0px 0px 50px',
      width: '100%',
      maxWidth: '100%'
    },
    [theme.breakpoints.up('lg')]: {
      margin: '0px 0px 0px 60px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0px 0px 0px 8px'
    }
  },
  collection: {
    flexBasis: 'unset',
    padding: '8px 8px 8px 16px !important'
  },
  showAll: {
    color: theme.palette.common.first,
    width: '100px',
    fontSize: '0.8rem',
    fontWeight: '400',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '-75px'
    }
  },
  chip: {
    color: `${theme.palette.common.second}77`
  }
})

const Collection = ({ classes, collection, username }) => {
  const fmtCollectionName = collection && collection.name.replace(/\s+/g, '-').toLowerCase()
  const collectionHref = fmtCollectionName && `/collections/${encodeURIComponent(fmtCollectionName.replace('/', ''))}/${collection._id}`
  const collectionLength = collection.postIds.length
  const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(Math.random() * 5) + 1}.png`
  const collectionSubheader =
    username === collection.owner
      ? collectionLength === 1
        ? `1 post`
        : `${collectionLength} posts`
      : collection.owner

  return (
    <Link
      to={collectionHref}
      style={{ textDecoration: 'none', color: '#fff' }}
    >
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        spacing={3}
        className={classes.collectionContainer}
      >
        <Grid item
          xs={2}
          lg={3}
          xl={2}
          className={classes.collection}
        >
          <Img
            src={[collection.imgSrcUrl, DEFAULT_IMG]}
            alt='thumbnail'
            className={classes.collectionImg}
          />
        </Grid>
        <Grid item
          xs={10}
          lg={9}
          xl={10}
        >
          <Typography variant='h5'>{collection.name}</Typography>
          <Typography variant='body2'>{collectionSubheader}</Typography>
        </Grid>
      </Grid>
    </Link>
  )
}

Collection.propTypes = {
  classes: PropTypes.object.isRequired,
  collection: PropTypes.array.isRequired,
  username: PropTypes.string
}

function TabPanel ({ children, value, index }) {
  return (
    <div id='tabpanel'
      hidden={value !== index}
    >
      <div>{children}</div>
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

class User extends Component {
  state = {
    posts: [],
    initialLoad: true,
    hasMore: true,
    start: 0,
    isLoading: true,
    dialogOpen: false,
    twitterDialogOpen: false,
    hasShared: false,
    ratingCount: 0,
    limit: 15,
    hasError: false,
    isTourOpen: false,
    isMinimize: false,
    showTour: true,
    collections: [],
    activeTab: 0,
    showAll: false
  }

  closeTour = () => {
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch(pushAccount(false))

    this.loadUserData()
    this.showDialog()

    if (!window.analytics) {
      window.analytics.page('User')
    }

    setTimeout(() => {
      this.setState({
        showTour: false
      })
    }, 30000)
  }

  showDialog = () => {
    const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
    const twitterInfo =
      cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)
    const showDialog = twitterInfo && !twitterInfo.seenTutorial
    if (showDialog) {
      const updatedTwitterInfo = { ...twitterInfo, seenTutorial: true }
      localStorage.setItem(
        'twitterMirrorInfo',
        JSON.stringify(updatedTwitterInfo)
      )
    }
  }

  componentDidUpdate (prevProps) {
    const prevUser = path.basename(prevProps.location.pathname)
    const currUser = path.basename(this.props.location.pathname)

    if (currUser !== prevUser) {
      // eslint-disable-next-line
      this.setState({
        posts: [],
        _id: '',
        initialLoad: true,
        // eslint-disable-next-line
        avatar: null,
        // eslint-disable-next-line
        eosname: null,
        // eslint-disable-next-line
        fullname: null,
        // eslint-disable-next-line
        quantile: null,
        // eslint-disable-next-line
        username: null,
        // eslint-disable-next-line
        bio: null,
        hasMore: true,
        start: 0,
        isLoading: true,
        hasError: false,
        isMinimize: false
      })
      this.loadUserData()
    }
  }

  handleScroll = e => {
    if (this.state.ratingCount <= 2) return
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

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false })
  }
  handleTwitterDialogOpen = () => {
    this.setState({ twitterDialogOpen: true })
  }

  handleTwitterDialogClose = () => {
    this.setState({ twitterDialogOpen: false, hasShared: true })
  }

  fetchPosts = async eosname => {
    let postData = { posts: [], totalCount: 0 }
    try {
      postData = (
        await axios.get(
          `${BACKEND_API}/feed/account/${eosname || this.state.eosname}?start=${this.state.start
          }&limit=${this.state.limit}`
        )
      ).data
      const newStart = this.state.start + this.state.limit
      this.setState({
        posts: this.state.posts.concat(postData.posts),
        hasMore: postData.totalCount > newStart,
        initialLoad: false,
        ratingCount: postData.totalCount,
        start: newStart
      })
    } catch (err) {
      this.setState({
        hasMore: false,
        initialLoad: false
      })
      console.log(err)
    }
  }

  fetchFollowing = async eosname => {
    const { dispatch, account } = this.props
    try {
      if (account && account.name) {
        await Promise.all([
          dispatch(fetchFollowing(eosname)),
          dispatch(fetchFollowing(account.name))
        ])
      } else {
        dispatch(fetchFollowing(eosname))
      }
    } catch (err) {
      console.log(err)
    }
  }

  fetchCollections = async eosname => {
    const collections = (
      await axios.get(`${BACKEND_API}/accounts/${eosname}/collections`)
    ).data
    this.setState({ collections })
  }

  redeemCreatorRewards = async () => {
    try {
      const { address } = JSON.parse(localStorage.getItem('YUP_ETH_AUTH'))
      await axios.get(`${REWARDS_MANAGER_API}/rewards/eth/nfts?address=${address}`)
    } catch (err) {
      rollbar.error(`Error redeeming creator rewards with err=${JSON.stringify(err)}`)
    }
  }

  loadUserData = () => {
    ; (async () => {
      try {
        const { dispatch } = this.props
        const username = path.basename(this.props.location.pathname)

        const { isLoading } = this.state

        if (!isLoading) {
          this.setState({ isLoading: true })
        }
        const account = (
          await axios.get(`${BACKEND_API}/levels/user/${username}`)
        ).data
        for (const key in account) {
          if (account[key] === null) {
            account[key] = ''
          }
        }
        this.setState({ ...account })
        const userData = await Promise.all([
          this.fetchFollowing(account._id),
          dispatch(fetchFollowers(account._id)),
          this.fetchPosts(account._id),
          this.fetchCollections(account._id)
        ])
        const newState = userData.reduce(
          (agg, data) => ({ ...agg, ...data }),
          {}
        )
        this.setState({ ...newState, ...account, isLoading: false })
      } catch (err) {
        this.setState({ hasError: true, isLoading: false })
      }
    })()
  }

  handleChange = (e, newTab) => {
    this.setState({ activeTab: newTab })
  }

  handleShowAll = () => {
    this.setState({
      showAll: !this.state.showAll
    })
  }

  render () {
    const { classes, account, theme, history } = this.props
    const {
      posts,
      _id: eosname,
      dialogOpen,
      initialLoad,
      hasMore,
      isLoading,
      ratingCount,
      balance,
      isMinimize,
      hasError,
      username,
      collections,
      activeTab,
      showAll,
      twitterDialogOpen,
      hasShared
    } = this.state

    const rewards = (new URLSearchParams(history.location.search)).get('rewards')
    localStorage.removeItem('YUP_CLAIM_RWRDS')
    if (rewards && !twitterDialogOpen && !hasShared) {
      this.handleTwitterDialogOpen()
      this.redeemCreatorRewards()
    }

    const isLoggedIn = account ? account.name === eosname : false
    if (!isLoading && hasError) {
      return (
        <ErrorBoundary>
          <div className={classes.container}>
            <div className={classes.page}>
              <div align='center'>
                <Typography
                  className={classes.accountErrorHeader}
                  color='#ffffff'
                  variant='h3'
                >
                  <strong>Sorry this page is not available.</strong>
                </Typography>
                <Typography
                  className={classes.accountErrorSub}
                  color='#ffffff'
                  variant='h4'
                >
                  The page you're looking for does not exist.
                </Typography>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )
    }

    return (
      <ErrorBoundary>
        <Helmet>
          <meta charSet='utf-8' />
          <title>{`${username} | Yup`}</title>
          <meta
            name='description'
            content={`${username}'s profile page on Yup.`}
          />
          <meta property='og:title'
            content={`${username} | Yup`}
          />
          <meta
            property='og:description'
            content={`${username}'s profile page on Yup.`}
          />
          <meta property='twitter:title'
            content={`${username} | Yup`}
          />
          <meta
            property='twitter:description'
            content={`${username}'s profile page on Yup.`}
          />
        </Helmet>
        <CollectionDialog
          account={account}
          dialogOpen={dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
        <Dialog
          open={showAll}
          onClose={this.handleShowAll}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <Typography variant='h3'>Collections</Typography>
          </DialogTitle>
          <DialogContent>
            {collections.map(collection => {
              return (
                <CollectionItem
                  collection={collection}
                  username={username}
                />
              )
            })}
          </DialogContent>
        </Dialog>
        <div className={classes.container}>
          <div className={classes.page}>
            <Grid
              container
              direction='row'
              justifyContent='flex-start'
              alignItems='flex-start'
              spacing={showTabs ? 2 : 4}
            >
              <Grid item
                xs={12}
              >
                <ProfileCard
                  account={account}
                  accountInfo={this.state}
                  balanceInfo={balance}
                  isLoggedIn={isLoggedIn}
                  ratingCount={ratingCount}
                  isMinimize={isMinimize}
                />
              </Grid>

              {showTabs && collections.length > 0 ? (
                <>
                  <Grid item
                    xs={12}
                  >
                    <Tabs value={activeTab}
                      onChange={this.handleChange}
                      TabIndicatorProps={{ style: { backgroundColor: theme.palette.common.first } }}
                    >
                      <Tab label='Feed'
                        className={classes.tabs}
                      />
                      <Tab label='Collections'
                        className={classes.tabs}
                      />
                    </Tabs>
                  </Grid>

                  <TabPanel value={activeTab}
                    index={0}
                  >
                    <Grid item
                      xs={12}
                    >
                      <InfiniteScroll
                        dataLength={posts.length}
                        hasMore={hasMore}
                        height={
                          isMinimize
                            ? 'calc(100vh - 160px)'
                            : 'calc(100vh - 320px)'
                        }
                        className={classes.infiniteScroll}
                        onScroll={this.handleScroll}
                        loader={
                          !initialLoad ? (
                            <div className={classes.feedLoader}>
                              <FeedLoader />
                            </div>
                          ) : (
                            ''
                          )
                        }
                        next={this.fetchPosts}
                      >
                        <Feed
                          isLoading={initialLoad}
                          renderObjects
                          hideInteractions={false}
                          posts={posts}
                          hasMore={hasMore}
                          classes={classes}
                        />
                      </InfiniteScroll>
                    </Grid>
                  </TabPanel>

                  <TabPanel value={activeTab}
                    index={1}
                  >
                    <Grid
                      item
                      container
                      column
                      spacing={isMobile ? 0 : 4}
                      tourname='Collections'
                      className={classes.collections}
                    >
                      {isLoggedIn && (
                        <Grid
                          item
                          xs={12}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Typography
                            variant='subtitle2'
                            style={{ marginRight: '10%', color: theme.palette.common.first }}
                            className={classes.collectionContainer}
                          >
                            Create new collection
                          </Typography>
                          <IconButton
                            aria-label='more'
                            aria-controls='long-menu'
                            aria-haspopup='true'
                            onClick={this.handleDialogOpen}
                            className={classes.icons}
                            size='large'>
                            <AddIcon />
                          </IconButton>
                        </Grid>
                      )}
                      <Grid item
                        xs={12}
                      >
                        {collections
                          .slice(0, LIMIT_COLLECTIONS)
                          .map(collection => {
                            return (
                              <CollectionItem
                                collection={collection}
                                username={username}
                              />
                            )
                          })}
                        {collections.length > LIMIT_COLLECTIONS && (
                          <Grid
                            container
                            alignItems='center'
                            justifyContent='center'
                          >
                            <Button
                              className={classes.showAll}
                              size='medium'
                              onClick={this.handleShowAll}
                            >
                              Show all
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </TabPanel>
                </>
              ) : (
                <>
                  <Grid item
                    lg={6}
                    xs={12}
                  >
                    <InfiniteScroll
                      dataLength={posts.length}
                      hasMore={hasMore}
                      height={
                        isMinimize
                          ? 'calc(100vh - 160px)'
                          : 'calc(100vh - 320px)'
                      }
                      className={classes.infiniteScroll}
                      onScroll={this.handleScroll}
                      loader={
                        !initialLoad ? (
                          <div className={classes.feedLoader}>
                            <FeedLoader />
                          </div>
                        ) : (
                          ''
                        )
                      }
                      next={this.fetchPosts}
                    >
                      <Feed
                        isLoading={initialLoad}
                        renderObjects
                        hideInteractions={false}
                        posts={posts}
                        hasMore={hasMore}
                        classes={classes}
                      />
                    </InfiniteScroll>
                  </Grid>

                  <Grid
                    item
                    container
                    justifyContent='space-between'
                    alignItems='center'
                    lg={4}
                    spacing={2}
                    tourname='Collections'
                    className={classes.collections}
                  >
                    {collections.length > 0 && (
                      <>
                        <Grid item
                          container
                          spacing={2}
                          xs={10}
                          alignItems='center'
                        >
                          <Grid item>
                            <Typography
                              variant='h5'
                            >Collections</Typography>
                          </Grid>
                          <Grid item>
                            {collections.length > LIMIT_COLLECTIONS && (
                              <Chip label={collections.length}
                                className={classes.chip}
                                size='small'
                                onClick={this.handleShowAll}
                              />
                            )}
                          </Grid>
                          <Grid item>
                            {isLoggedIn && (
                              <IconButton
                                size='small'
                                variant='contained'
                                aria-label='more'
                                aria-controls='long-menu'
                                aria-haspopup='true'
                                onClick={this.handleDialogOpen}
                                className={classes.chip}
                              >
                                <AddIcon fontSize='small' />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                        <Grid item
                          xs={12}
                        >
                          {collections
                            .slice(0, LIMIT_COLLECTIONS)
                            .map(collection => {
                              return (
                                <CollectionItem
                                  collection={collection}
                                  username={username}
                                />
                              )
                            })}
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              )}
            </Grid>

            <Tour
              steps={steps}
              isOpen={this.state.isTourOpen}
              onRequestClose={this.closeTour}
              className={classes.Tour}
              accentColor='#00E08E'
              rounded={10}
              disableInteraction
              highlightedMaskClassName={classes.Mask}
              nextButton={
                <Button
                  size='small'
                  variant='outlined'
                  style={{ fontWeight: 400, backgroundColor: '#00E08E' }}
                  small
                >
                  Next
                </Button>
              }
              prevButton={
                <Button
                  size='small'
                  variant='outlined'
                  style={{ fontWeight: 400, backgroundColor: '#00E08E' }}
                >
                  Back
                </Button>
              }
              lastStepNextButton={<div style={{ display: 'none' }} />}
            />
            <Fade in={this.state.showTour}
              timeout={1000}
            >
              <Fab
                className={classes.tourFab}
                variant='extended'
                onClick={this.openTour}
              >
                10-Second Tutorial
              </Fab>
            </Fade>
          </div>
          <CreateCollectionFab />
          <ShareTwitterDialog
            dialogOpen={twitterDialogOpen}
            handleDialogClose={this.handleTwitterDialogClose}
            tweetTitle={`Claiming creator rewards on @yup_io`}
            url={`${WEB_APP_URL}/rewards`}
            headerText={`You have been allocated ${Math.round(rewards)} YUP!`}
            bodyText={`Please share on Twitter to claim your rewards. You should receive your tokens within a few minutes.`}
          />
        </div>
      </ErrorBoundary>
    )
  }
}

const steps = [
  {
    selector: '[tourName="ProfileUsername"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >👩‍🚀 User Profile</Typography>
        <p className='tourText'>
          Where you'll find important information on each user as well as
          yourself!
        </p>
        <a href='https://docs.yup.io'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="Influence"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >💯 Yup Score</Typography>
        <p className='tourText'>
          A score out of 100 showing how influential a user is. The higher the
          number, the more powerful your opinions!
        </p>
        <a
          href='https://docs.yup.io/basic/colors'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="YUPBalance"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >💰 YUP Balance</Typography>
        <p className='tourText'>
          The amount of YUP tokens you've earned. Rate any piece of content to
          earn more!
        </p>
        <a
          href='https://docs.yup.io/protocol/yup-protocol#yup-token'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="ProfileFeed"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📰 User Feed</Typography>
        <p className='tourText'>This is this user's rated content, aggregated into a feed.</p>
      </div>
    )
  },
  {
    selector: '[tourName="Collections"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📚 Collections</Typography>
        <p className='tourText'>
          These are curated, personal collections. Create your own, add your
          favorite pieces of content, and share with the world.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📡 Feeds</Typography>
        <p className='tourText'>These are your feeds.</p>
        <a
          href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >🔍 Search</Typography>
        <p className='tourText'>Search for friends and influencers across the web.</p>
      </div>
    )
  },
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📈 Leaderboard</Typography>
        <p className='tourText'>Find content and users ranked by category and platform.</p>
        <a
          href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    content: (
      <div>
        <Typography variant='h3'
          className='tourHeader'
        >👏 That's it !</Typography>
        <p className='tourText'>That's all for now. Learn more with some of these resources:</p>
        <div className='tourResources'>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://docs.yup.io'
            target='_blank'
          >
            Docs
          </Button>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://yup.io'
            target='_blank'
          >
            Website
          </Button>
          <Button
            size='medium'
            variant='contained'
            style={{ fontWeight: 400 }}
            small
            className='tourButton'
            href='https://blog.yup.io'
            target='_blank'
          >
            Blog
          </Button>
        </div>
        <ReactPlayer
          controls
          style={{ overFlow: 'hidden', maxHeight: '200px' }}
          url={EXPLAINER_VIDEO}
          width='100%'
        />
      </div>
    )
  }
]

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return {
    account,
    push: state.scatterInstallation.push
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(withTheme(User)))
