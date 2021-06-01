import React, { Component } from 'react'
import Header from '../../components/Header/Header'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import { withStyles } from '@material-ui/core/styles'
import Img from 'react-image'
import { Fab, Typography, Grid, Button, IconButton, Icon, SnackbarContent, Snackbar, Fade, Tabs, Tab, Hidden, ThemeProvider } from '@material-ui/core'
import SideDrawer from '../../components/SideDrawer/SideDrawer'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import '../../styles.css'
import axios from 'axios'
import DotSpinner from '../../components/DotSpinner/DotSpinner'
import MenuIcon from '@material-ui/icons/Menu'
import { Link } from 'react-router-dom'
import CollectionEditDialog from '../../components/Collections/CollectionEditDialog.js'
import RecommendedCollections from '../../components/Collections/RecommendedCollections.js'
import { Helmet } from 'react-helmet'
import { levelColors } from '../../utils/colors'
import theme from '../../utils/theme'

const BACKEND_API = process.env.BACKEND_API
const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(Math.random() * 5) + 1}.png`
const showTabs = window.innerWidth <= 960

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
    color: '#fff',
    overflowY: 'scroll'
  },
  feedPage: {
    marginLeft: '40px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '30px',
      maxWidth: '550px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      margin: 'auto'
    }
  },
  collectionHeader: {
    position: 'sticky',
    top: '60px',
    background: 'linear-gradient(0deg,#1a1a1a,#1b1b1b)',
    borderRadius: '5px',
    zIndex: 1000,
    marginBottom: '25px',
    paddingLeft: '60px !important',
    [theme.breakpoints.down('lg')]: {
      paddingLeft: '40px !important'
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '20px !important',
      top: 0,
      marginBottom: '0px'
    }
  },
  collectionContainer: {
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      margin: '0px'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  page: {
    width: '100vw',
    marginTop: '50px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: 50
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: '200px',
      width: `calc(100vw - 200px)`,
      marginTop: '50px'
    },
    [theme.breakpoints.down('xs')]: {
      background: '#1b1b1ba1',
      backgroundSize: 'contain',
      overflowX: 'hidden'
    },
    flex: 1
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourFab: {
    position: 'absolute',
    bottom: theme.spacing(7),
    right: theme.spacing(12),
    background: '#A0A0A0AA',
    color: '#FAFAFA',
    zIndex: 1000,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  headerText: {
    marginBottom: '10px'
  },
  recommended: {
    display: 'inline-block',
    position: 'sticky',
    top: 200,
    margin: '0 0 0 20px',
    opacity: 0.7,
    '&:hover': {
      opacity: 1
    },
    [theme.breakpoints.down('md')]: {
      margin: '0px 0px 0px 50px',
      width: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0px 0px 0px 30px'
    }
  },
  headerImg: {
    width: '100%',
    maxWidth: '100px',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      marginBottom: '0px'
    }
  },
  icons: {
    color: '#c0c0c0'
  },
  hidden: {
    display: 'none'
  },
  minimize: {
    height: '50px',
    width: '50px',
    [theme.breakpoints.down('xs')]: {
      height: '35px',
      width: '35px'
    }
  },
  minimizeHeader: {
    padding: '0px 16px',
    transition: 'max-height 0.2s linear',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '60px'
    }
  },
  snack: {
    justifyContent: 'center'
  },
  tabs: {
    color: '#fff',
    fontSize: '1.2rem',
    marginLeft: '35px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '15px'
    }
  }
})

function TabPanel (props) {
  const { children, value, index } = props

  return (
    <div role='tabpanel'
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

class Collections extends Component {
  state = {
    collection: null,
    posts: [],
    isLoading: true,
    isMinimize: false,
    snackbarMsg: '',
    recommended: [],
    dialogOpen: false,
    isTourOpen: false,
    socialLevelColor: '',
    activeTab: 0
  }

  async componentDidMount () {
    const decodedURL = decodeURI(window.location.href)
    const url = decodedURL.split('/')
    const id = url[5]

    let collection, recommended
    try {
      collection = (await axios.get(`${BACKEND_API}/collections/name/${id}`)).data
      recommended = (await axios.get(`${BACKEND_API}/collections/recommended`)).data
    } catch (err) {
      this.setState({ isLoading: false })
      console.log(err)
    }
    this.getSocialLevel(collection.ownerId)

    this.setState({
      isLoading: false,
      collection,
      recommended,
      posts: collection.posts.reverse()
    })
  }

  shareCollection = e => {
    e.preventDefault()
    navigator.clipboard.writeText(window.location.href)
    this.handleSnackbarOpen('Copied collection to clipboard')
  }

  handleScroll = e => {
    if (this.state.posts.length <= 2) return
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

  handleSnackbarOpen = snackbarMsg => {
    this.setState({ snackbarMsg })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarMsg: '' })
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false })
  }

  getSocialLevel = async id => {
    const res = (await axios.get(`${BACKEND_API}/levels/user/${id}`)).data
    this.setState({
      socialLevelColor: levelColors[res.quantile]
    })
  }

  closeTour = () => {
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  handleChange = (e, newTab) => {
    this.setState({ activeTab: newTab })
  }

  render () {
    const { classes, account } = this.props
    const {
      collection,
      posts,
      isLoading,
      isMinimize,
      snackbarMsg,
      recommended,
      dialogOpen,
      socialLevelColor,
      activeTab
    } = this.state

    const hidden = isMinimize ? classes.hidden : null
    const minimize = isMinimize ? classes.minimize : null
    const minimizeHeader = isMinimize ? classes.minimizeHeader : null
    const isLoggedUserCollection =
      (account && account.name) === (collection && collection.ownerId)

    const len = posts.length - 1
    let headerImgSrc = posts &&
      ((posts[len] && posts[len].previewData.img) || (posts[len - 1] && posts[len - 1].previewData.img))

    if (!isLoading && !collection) {
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
          </ThemeProvider>
        </ErrorBoundary>
      )
    }

    if (isLoading) {
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

    return (
      <ErrorBoundary>
        <Helmet>
          <meta charSet='utf-8' />
          <title>{`${collection.name} | ${collection.owner}`}</title>
          <meta name='description'
            content={`${collection.description}`}
          />
          <meta
            property='og:title'
            content={`${collection.name} | ${collection.owner}`}
          />
          <meta
            property='og:description'
            content={`${collection.description}`}
          />
          <meta property='og:image'
            content={`${collection.coverImgSrc}`}
          />
          <meta
            property='twitter:card'
            content='summary_large_image'
          />
          <meta
            property='twitter:site'
            content='@yup_io'
          />
          <meta
            property='twitter:title'
            content={`${collection.name} | ${collection.owner}`}
          />
          <meta property='twitter:image'
            content={`${collection.coverImgSrc}`}
          />
          <meta
            property='twitter:description'
            content={`${collection.description}`}
          />
        </Helmet>

        <Snackbar
          autoHideDuration={4000}
          onClose={this.handleSnackbarClose}
          open={!!snackbarMsg}
        >
          <SnackbarContent className={classes.snack}
            message={snackbarMsg}
          />
        </Snackbar>
        <CollectionEditDialog
          collection={collection}
          account={account}
          dialogOpen={dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />

        <div className={classes.container}
          onScroll={this.handleScroll}
        >
          <div className={classes.page}>
            <Header />
            <SideDrawer />
            <Grid
              container
              direction='row'
              justify='flex-start'
              alignItems='flex-start'
              spacing={2}
              className={classes.collectionContainer}
            >
              <Grid
                item
                container
                direction='row'
                justify='flex-start'
                alignItems='center'
                spacing={2}
                lg={8}
                xs={12}
                className={[minimizeHeader, classes.collectionHeader]}
              >
                <Grid
                  item
                  lg={isMinimize ? 1 : 2}
                  md={isMinimize ? 1 : 2}
                  sm={2}
                  xs={2}
                >
                  <Fade in
                    timeout={1000}
                  >
                    <Img
                      src={[headerImgSrc, DEFAULT_IMG]}
                      alt='thumbnail'
                      loader={<div />}
                      className={`${classes.headerImg} ${minimize}`}
                    />
                  </Fade>
                </Grid>
                <Grid item
                  lg={isMinimize ? 7 : 6}
                  md={isMinimize ? 7 : 6}
                  sm={8}
                  xs={6}
                >
                  <Fade in
                    timeout={400}
                  >
                    <Typography variant='h2'
                      className={classes.headerText}
                    >
                      {collection.name}
                    </Typography>
                  </Fade>
                  <Fade in
                    timeout={800}
                  >
                    <Typography
                      variant='h5'
                      className={[classes.headerText, hidden]}
                    >
                      Curated by{' '}
                      <Link
                        to={`/${collection.owner}`}
                        style={{
                          color: '#fff',
                          textDecoration: socialLevelColor
                            ? `1px solid underline ${socialLevelColor}`
                            : 'none'
                        }}
                      >
                        {collection.owner}
                      </Link>
                    </Typography>
                  </Fade>
                  <Typography
                    variant='subtitle2'
                    className={[classes.headerText, hidden]}
                  >
                    {collection.description}
                  </Typography>
                </Grid>
                <Grid
                  item
                  container
                  lg={4}
                  sm={2}
                  xs={4}
                  justify='flex-end'
                >
                  <IconButton
                    aria-label='more'
                    aria-controls='long-menu'
                    aria-haspopup='true'
                    onClick={this.shareCollection}
                  >
                    <Icon
                      className={[classes.icons, 'fa fa-share']}
                    />
                  </IconButton>
                  {isLoggedUserCollection && (
                    <IconButton
                      aria-label='more'
                      aria-controls='long-menu'
                      aria-haspopup='true'
                      onClick={this.handleDialogOpen}
                      className={classes.icons}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>

              <Hidden lgDown>
                <Grid item
                  lg={4}
                />
              </Hidden>

              {showTabs ? <>
                <Grid item
                  xs={12}
                >
                  <Tabs value={activeTab}
                    onChange={this.handleChange}
                  >
                    <Tab label='Feed'
                      className={classes.tabs}
                    />
                    <Tab label='Recommended'
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
                    <Feed
                      isLoading={isLoading}
                      hasMore={false}
                      classes={classes}
                      posts={posts}
                      hideInteractions
                      renderObjects
                      tourname='CollectionPosts'
                    />
                  </Grid>
                </TabPanel>

                <TabPanel value={activeTab}
                  index={1}
                >
                  <Grid item
                    container
                    column
                    spacing={4}
                    tourname='RecommendedCollections'
                    className={classes.recommended}
                  >
                    {recommended.map(rec => {
                      if (rec.name !== collection.name) {
                        return (
                          <RecommendedCollections
                            classes={classes}
                            collection={rec}
                          />
                        )
                      }
                    })}
                  </Grid>
                </TabPanel>
              </>

              : <>
                <Grid item
                  lg={6}
                  xs={12}
                >
                  <Feed
                    isLoading={isLoading}
                    hasMore={false}
                    classes={classes}
                    posts={posts}
                    hideInteractions
                    renderObjects
                    tourname='CollectionPosts'
                  />
                </Grid>

                <Grid
                  item
                  container
                  lg={4}
                  spacing={2}
                  tourname='RecommendedCollections'
                  className={classes.recommended}
                >
                  <Grid item
                    xs={12}
                  >
                    <Typography variant='h4'>Recommended</Typography>
                  </Grid>
                  <Grid item
                    xs={12}
                  >
                    {recommended.map(rec => {
                      if (rec.name !== collection.name) {
                        return (
                          <RecommendedCollections
                            classes={classes}
                            collection={rec}
                          />
                        )
                      }
                    })}
                  </Grid>
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
              lastStepNextButton={<div style={{ display: 'none' }} />}
            />
            <Fab
              className={classes.tourFab}
              variant='ext fcomended'
              onClick={this.openTour}
            >
              10-Second Tutorial
            </Fab>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
}

const steps = [
  {
    selector: '[tourName="CollectionPosts"]',
    content: (
      <div>
        <h4 className='tourHeader'>📰 Collection Posts</h4>
        <p>These are the curated posts in this collection.</p>
      </div>
    )
  },
  {
    selector: '[tourName="RecommendedCollections"]',
    content: (
      <div>
        <h4 className='tourHeader'>📖 Recommended Collections</h4>
        <p>These are some other collections you should check out!</p>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <h4 className='tourHeader'>📡 Feeds</h4>
        <p>These are your feeds.</p>
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
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <h4 className='tourHeader'>📈 Leaderboard</h4>
        <p>Find content and users ranked by category and platform.</p>
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
        <h3 className='tourHeader'>👏 That's it!</h3>
        <p>That's all for now. Learn more with some of these resources:</p>
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
      </div>
    )
  }
]

const mapStateToProps = state => {
  const { account: ethAccount } = state.ethAuth
  const scatterIdentity = state.scatterRequest && state.scatterRequest.account
  let account = scatterIdentity || state.ethAccount
  const levels = state.socialLevels.levels

  if (!scatterIdentity && ethAccount) {
    account = { name: ethAccount._id, authority: 'active' }
  }

  return {
    account,
    levels,
    push: state.scatterInstallation.push,
    collections: state.collections
  }
}

Collections.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Collections))
