import React, { Component } from 'react'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import Header from '../../components/Header/Header'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll'
import Footer from '../../components/Footer/Footer'
import FeedLoader from '../../components/FeedLoader/FeedLoader'
import { withStyles } from '@material-ui/core/styles'
import { Fab, Typography, Grid, Button, IconButton, Fade, Hidden, Tabs, Tab, Dialog, DialogTitle, DialogContent, ThemeProvider } from '@material-ui/core'
import axios from 'axios'
import SideDrawer from '../../components/SideDrawer/SideDrawer'
import { pushAccount, fetchFollowers, fetchFollowing } from '../../redux/actions'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { withRouter, Link } from 'react-router-dom'
import path from 'path'
import Tour from 'reactour'
import Img from 'react-image'
import '../../components/Tour/tourstyles.css'
import ReactPlayer from 'react-player'
import { Helmet } from 'react-helmet'
import AddIcon from '@material-ui/icons/Add'
import CollectionPostDialog from '../../components/Collections/CollectionPostDialog.js'
import '../../styles.css'
import theme from '../../utils/theme'

const BACKEND_API = process.env.BACKEND_API
const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'
const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(Math.random() * 5) + 1}.png`
const LIMIT_COLLECTIONS = 5
const showTabs = window.innerWidth <= 960
const isMobile = window.innerWidth <= 600

const styles = theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      display: 'none'
    }
  },
  accountErrorHeader: {
    paddingTop: '15%',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.5rem',
    color: '#ffffff'
  },
  accountErrorSub: {
    paddingTop: '25px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '1rem',
    color: '#ffffff'
  },
  container: {
    background: 'linear-gradient(180deg, #1B1B1B 0%, #151515 100%)',
    height: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
    [theme.breakpoints.down('xs')]: {
      background: '#2a2a2a'
    }
  },
  feedPage: {
    marginLeft: '110px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '30px',
      maxWidth: '550px'
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '15px'
    }
  },
  feedLoader: {
    backgroundSize: 'cover',
    maxWidth: '625px',
    minWidth: '250px',
    minHeight: '800px',
    marginLeft: '110px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '30px',
      maxWidth: '550px'
    },
    [theme.breakpoints.down('xs')]: {
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
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 200,
      width: `calc(100% - 200px)`
    },
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1',
      backgroundSize: 'contain',
      overflowX: 'hidden'
    },
    flex: 1
  },
  progress: {
    margin: theme.spacing(2),
    color: 'white'
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourFab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    background: '#A0A0A0AA',
    color: '#FAFAFA',
    zIndex: 1000,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  icons: {
    color: '#fff'
  },
  collectionImg: {
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    borderRadius: '5px',
    [theme.breakpoints.down('md')]: {
      height: '50px',
      width: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      height: '40px',
      width: '40px',
      marginTop: '5px'
    }
  },
  collectionContainer: {
    borderRadius: 10,
    margin: 0,
    '&:hover': {
      background: '#fafafa05'
    }
  },
  tabs: {
    color: '#fff',
    fontSize: '1.2rem',
    marginLeft: '35px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '15px'
    }
  },
  collections: {
    color: '#fff',
    zIndex: '999',
    marginLeft: '20px',
    [theme.breakpoints.down('md')]: {
      margin: '0px 0px 0px 50px',
      width: '100%'
    }
  },
  collection: {
    flexBasis: 'unset',
    padding: '8px 8px 8px 0px !important'
  },
  showAll: {
    color: '#fff',
    width: '100px',
    fontSize: '0.8rem',
    fontWeight: '400',
    [theme.breakpoints.down('md')]: {
      marginLeft: '-75px'
    }
  }
})

const Collection = ({ classes, collection, username }) => {
  const fmtCollectionName = collection && (collection.name).replace(/\s+/g, '-').toLowerCase()
  const collectionLength = collection.postIds.length
  const collectionSubheader = username === collection.owner ? (collectionLength === 1 ? `1 post` : `${collectionLength} posts`) : collection.owner

  return (
    <Link to={`/collections/${encodeURIComponent(fmtCollectionName)}/${collection._id}`}
      style={{ textDecoration: 'none', color: '#fff' }}
    >
      <Grid container
        direction='row'
        justify='flex-start'
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
          <Typography variant='h5'>
            {collection.name}
          </Typography>
          <Typography variant='body2'>
            {collectionSubheader}
          </Typography>
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

function TabPanel (props) {
  const { children, value, index } = props

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
    window.Intercom('update')
    window.analytics.page('User')

    setTimeout(() => {
      this.setState({
        showTour: false
      })
    }, 30000)
  }

  showDialog = () => {
    const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
    const twitterInfo = cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)
    const showDialog = twitterInfo && !twitterInfo.seenTutorial
    if (showDialog) {
      const updatedTwitterInfo = { ...twitterInfo, seenTutorial: true }
      localStorage.setItem('twitterMirrorInfo', JSON.stringify(updatedTwitterInfo))
      this.setState({ dialogOpen: true })
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

  handleScroll = (e) => {
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

  fetchPosts = async (eosname) => {
    let postData = { posts: [], totalCount: 0 }
    try {
      postData = (await axios.get(`${BACKEND_API}/feed/account/${eosname || this.state.eosname}?start=${this.state.start}&limit=${this.state.limit}`)).data
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

  fetchFollowing = async (eosname) => {
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

  fetchCollections = async (eosname) => {
    const collections = (await axios.get(`${BACKEND_API}/accounts/${eosname}/collections`)).data
    this.setState({ collections })
  }

  loadUserData = () => {
    (async () => {
      try {
        const { dispatch } = this.props
        const username = path.basename(this.props.location.pathname)

        const { isLoading } = this.state

        if (!isLoading) {
          this.setState({ isLoading: true })
        }
        const account = (await axios.get(`${BACKEND_API}/levels/user/${username}`)).data
        this.setState({ ...account })
        const userData = await Promise.all([
          this.fetchFollowing(account._id),
          dispatch(fetchFollowers(account._id)),
          this.fetchPosts(account._id),
          this.fetchCollections(account._id)
        ])
        const newState = userData.reduce((agg, data) => ({ ...agg, ...data }), {})
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
    const { classes, account } = this.props
    const { posts, _id: eosname, dialogOpen, initialLoad, hasMore, isLoading, ratingCount, balance, isMinimize, hasError, username, collections, activeTab, showAll } = this.state

    const isLoggedIn = (account ? (account.name === eosname) : false)

    if (!isLoading && hasError) {
      return (
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <div className={classes.container}>
              <div className={classes.page}>
                <Header isTourOpen={this.state.isTourOpen} />
                <div align='center'>
                  <Typography
                    className={classes.accountErrorHeader}
                    color='#ffffff'
                    variant='h3'
                  >
                    <strong>
                      Sorry this page is not available.
                    </strong>
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
          </ThemeProvider>
        </ErrorBoundary>
      )
    }

    return (
      <ErrorBoundary>
        <Helmet>
          <meta charSet='utf-8' />
          <title>{`${username} | Yup`}</title>
          <meta name='description'
            content={`${username}'s profile page on Yup.`}
          />
          <meta property='og:title'
            content={`${username} | Yup`}
          />
          <meta property='og:description'
            content={`${username}'s profile page on Yup.`}
          />
          <meta property='twitter:title'
            content={`${username} | Yup`}
          />
          <meta property='twitter:description'
            content={`${username}'s profile page on Yup.`}
          />
        </Helmet>

        <CollectionPostDialog
          account={account}
          dialogOpen={dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
        <Dialog open={showAll}
          onClose={this.handleShowAll}
          aria-labelledby='form-dialog-title'
          PaperProps={{
            style: {
              backgroundColor: '#0A0A0A',
              borderRadius: '25px',
              boxShadow: '0px 0px 20px 6px rgba(255, 255, 255, 0.1)',
              width: '80%',
              padding: '1rem 0.5rem',
              maxHeight: '50vh',
              maxWidth: '500px',
              color: '#fafafa'
            }
          }}
          BackdropProps={{
            style: {
              backdropFilter: 'blur(3px)'
            }
          }}
        >
          <DialogTitle id='form-dialog-title'>
            <Typography variant='h3'>Collections</Typography>
          </DialogTitle>
          <DialogContent>
            {
              collections.map((collection) => {
                return (
                  <Collection classes={classes}
                    collection={collection}
                    username={username}
                  />
                )
              })
            }
          </DialogContent>
        </Dialog>
        <ThemeProvider theme={theme}>
          <div className={classes.container}>
            <div className={classes.page}>
              <Header />
              <SideDrawer />
              <Grid container
                direction='row'
                justify='flex-start'
                alignItems='flex-start'
                spacing={showTabs ? 2 : 4}
              >
                <Grid item
                  lg={6}
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
                <Hidden mdDown>
                  <Grid item
                    lg={6}
                  />
                </Hidden>

                {showTabs && collections.length > 0 ? <>
                  <Grid item
                    xs={12}
                  >
                    <Tabs value={activeTab}
                      onChange={this.handleChange}
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
                        height={isMinimize ? 'calc(100vh - 160px)' : 'calc(100vh - 320px)'}
                        className={classes.infiniteScroll}
                        onScroll={this.handleScroll}
                        loader={
                          !initialLoad
                            ? <div className={classes.feedLoader}>
                              <FeedLoader />
                            </div>
                            : ''
                        }
                        next={this.fetchPosts}
                      >
                        <Feed isLoading={initialLoad}
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
                    <Grid item
                      container
                      column
                      spacing={isMobile ? 0 : 4}
                      tourname='Collections'
                      className={classes.collections}
                    >
                      {
                        isLoggedIn &&
                          <Grid item
                            xs={12}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Typography variant='subtitle2'
                              style={{ marginRight: '10%', color: '#fff' }}
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
                            >
                              <AddIcon />
                            </IconButton>
                          </Grid>
                      }
                      <Grid item
                        xs={12}
                      >
                        {collections.slice(0, LIMIT_COLLECTIONS).map((collection) => {
                            return (
                              <Collection classes={classes}
                                collection={collection}
                                username={username}
                              />
                            )
                          })
                        }
                        {collections.length > LIMIT_COLLECTIONS &&
                        <Grid container

                          alignItems='center'
                          justify='center'
                        >
                          <Button className={classes.showAll}
                            size='medium'
                            onClick={this.handleShowAll}
                          >
                            Show all
                          </Button>
                          </Grid>
                        }
                      </Grid>
                    </Grid>
                  </TabPanel>
                </>

                : <>
                  <Grid item
                    lg={6}
                    xs={12}
                  >
                    <InfiniteScroll
                      dataLength={posts.length}
                      hasMore={hasMore}
                      height={isMinimize ? 'calc(100vh - 160px)' : 'calc(100vh - 320px)'}
                      className={classes.infiniteScroll}
                      onScroll={this.handleScroll}
                      loader={
                        !initialLoad
                          ? <div className={classes.feedLoader}>
                            <FeedLoader />
                          </div>
                          : ''
                      }
                      next={this.fetchPosts}
                    >
                      <Feed isLoading={initialLoad}
                        renderObjects
                        hideInteractions={false}
                        posts={posts}
                        hasMore={hasMore}
                        classes={classes}
                      />
                    </InfiniteScroll>
                  </Grid>

                  <Grid item
                    lg={4}
                    spacing={2}
                    tourname='Collections'
                    className={classes.collections}
                  >
                    {collections.length > 0 &&
                      <>
                        <Grid item
                          xs={12}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <Typography variant='h4'
                            style={{ marginRight: '10%', marginLeft: '20px' }}
                          >
                            Collections
                          </Typography>
                          {
                            isLoggedIn &&
                            <IconButton
                              aria-label='more'
                              aria-controls='long-menu'
                              aria-haspopup='true'
                              onClick={this.handleDialogOpen}
                              className={classes.icons}
                            >
                              <AddIcon />
                            </IconButton>
                          }
                        </Grid>
                        <Grid item
                          xs={12}
                        >
                          {
                            collections.slice(0, LIMIT_COLLECTIONS).map((collection) => {
                              return (
                                <Collection classes={classes}
                                  collection={collection}
                                  username={username}
                                />
                              )
                            })
                          }
                          {collections.length > LIMIT_COLLECTIONS &&
                          <Grid container

                            alignItems='center'
                            justify='center'
                          >
                            <Button className={classes.showAll}
                              size='medium'
                              onClick={this.handleShowAll}
                            >
                              Show all
                            </Button>
                          </Grid>
                          }
                        </Grid>
                      </>
                    }
                  </Grid>
                </>
                }
              </Grid>

              <Tour
                steps={steps}
                isOpen={this.state.isTourOpen}
                onRequestClose={this.closeTour}
                className={classes.Tour}
                accentColor='#00eab7'
                rounded={10}
                disableInteraction
                highlightedMaskClassName={classes.Mask}
                nextButton={
                  <Button
                    size='small'
                    variant='outlined'
                    style={{ fontWeight: 400 }}
                    small
                  >
                    Next
                  </Button>
                }
                prevButton={
                  <Button
                    size='small'
                    variant='outlined'
                    style={{ fontWeight: 400 }}
                  >
                    Back
                  </Button>
                }
                lastStepNextButton={
                  <div
                    style={{ display: 'none' }}
                  />
                }
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
            <Footer />
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    )
  }
}

const steps = [
  {
    selector: '[tourName="ProfileUsername"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          👩‍🚀 User Profile
        </h4>
        <p>
          Where you'll find important information on each user as well as yourself!
        </p>
        <a href='https://docs.yup.io'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="Influence"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          💯  Influence Score
        </h4>
        <p>
          A score out of 100 showing how influential a user is. The higher the number, the more powerful your opinions!
        </p>
        <a href='https://docs.yup.io/basic/colors'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="YUPBalance"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          💰  YUP Balance
        </h4>
        <p>
          The amount of YUP tokens you've earned. Rate any piece of content to earn more!
        </p>
        <a href='https://docs.yup.io/protocol/yup-protocol#yup-token'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="ProfileFeed"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📰  User Feed
        </h4>
        <p>
          This is this user's rated content, aggregated into a feed.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="Collections"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📚  Collections
        </h4>
        <p>
          These are curated, personal collections.
          Create your own, add your favorite pieces of content, and share with the world.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📡  Feeds
        </h4>
        <p>
          These are your feeds.
        </p>
        <a href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          🔍  Search
        </h4>
        <p>
          Search for friends and influencers across the web.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <h4 className='tourHeader'>
          📈  Leaderboard
        </h4>
        <p>
          Find content and users ranked by category and platform.
        </p>
        <a href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    content: (
      <div>
        <h3 className='tourHeader'>
          👏 That's it !
        </h3>
        <p>
          That's all for now. Learn more with some of these resources:
        </p>
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
  const { account: ethAccount } = state.ethAuth
  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || state.ethAccount

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  return {
    account,
    push: state.scatterInstallation.push
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(User)))
