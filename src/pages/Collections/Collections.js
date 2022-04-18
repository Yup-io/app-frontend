import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import { withStyles, withTheme } from '@material-ui/core/styles'
import Img from 'react-image'
import { Fab, Typography, Grid, IconButton, Icon, SnackbarContent, Snackbar, Fade, Tabs, Tab, Menu, MenuItem } from '@material-ui/core'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import StyledTourResources from '../../components/Tour/StyledTourResources'
import axios from 'axios'
import DotSpinner from '../../components/DotSpinner/DotSpinner'
import { Link } from 'react-router-dom'
import { CollectionEditDialog, CollectionDuplicateDialog, CollectionReorderDialog, RecommendedCollections } from '../../components/Collections'
import { Helmet } from 'react-helmet'
import { levelColors } from '../../utils/colors'
import { CreateCollectionFab, YupButton } from '../../components/Miscellaneous'
import { setTourAction, fetchSocialLevel } from '../../redux/actions'
import { accountInfoSelector } from '../../redux/selectors'
import { Skeleton } from '@material-ui/lab'
import { PageHeader, PageBody } from '../pageLayouts'

const BACKEND_API = process.env.BACKEND_API
const DEFAULT_IMG = `https://app-gradients.s3.amazonaws.com/gradient${Math.floor(
  Math.random() * 5
) + 1}.png`
const showTabs = window.innerWidth <= 960

const styles = theme => ({
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
    fontSize: '1rem'
  },
  container: {
    height: '100vh',
    width: '100vw',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll'
  },
  feedPage: {
    width: '550px',
    [theme.breakpoints.down('lg')]: {
      maxWidth: '550px'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      marginLeft: '0vw'
    }
  },
  menuItem: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  page: {
    width: '100vw',
    backgroundSize: 'contain',
    overflowX: 'hidden'
  },
  Skeleton: {
    background: theme.palette.M600,
    margin: '20px 0 ',
    borderRadius: '8px'
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourText: {
    color: theme.palette.M800
  },
  tourFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    background: theme.palette.M100,
    color: theme.palette.M800,
    zIndex: 1000,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  headerTitle: {
    [theme.breakpoints.down('xs')]: {
      lineHeight: 1,
      fontSize: '1.6rem'
    }
  },
  recommended: {
    display: 'inline-block',
    position: 'sticky',
    top: 180,
    opacity: 0.7,
    '&:hover': {
      opacity: 1
    },
    [theme.breakpoints.down('md')]: {
      width: '500px'
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0px 0px 0px 30px'
    }
  },
  recommendedMobile: {
    overflowY: 'hidden'
  },
  headerImg: {
    width: '100%',
    maxWidth: '100px',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0
    }
  },
  icons: {
    color: `${theme.palette.M100} !important`
  },
  curatedByName: {
    color: theme.palette.M100
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
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '60px'
    }
  },
  snack: {
    justifyContent: 'center'
  },
  tabs: {
    color: theme.palette.M100,
    fontSize: '1.2rem',
    marginLeft: '35px',
    textTransform: 'capitalize',
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
    recommendedLoading: true,
    isMinimize: false,
    snackbarMsg: '',
    recommended: [],
    socialLevelColor: '',
    activeTab: 0,
    anchorEl: null,
    openReorderDialog: false,
    editDialogOpen: false,
    duplicateDialogOpen: false
  }

  fetchCollectionInfo = async () => {
    const decodedURL = decodeURI(window.location.href)
    const url = decodedURL.split('/')
    const id = url[5]

    let collection, recommended
    try {
      collection = (await axios.get(`${BACKEND_API}/collections/name/${id}`)).data
      this.setState({
        isLoading: false,
        collection,
        posts: collection.posts.reverse()
      })
      const requQuery = `name=${collection.name}&description=${collection.description}&id=${id}`
      recommended = (await axios.get(`${BACKEND_API}/collections/recommended?${requQuery}`)).data
      this.setState({
        recommendedLoading: false,
        recommended
      })
    } catch (err) {
      this.setState({ isLoading: false })
      console.log(err)
    }
  }

  componentDidMount () {
    this.fetchCollectionInfo()
  }

  componentDidUpdate ({ location: prevLocation }) {
    const currLocation = this.props.location
    if (prevLocation.pathname !== currLocation.pathname) {
      this.fetchCollectionInfo()
    }
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

  handleSnackbarOpen = snackbarMsg => this.setState({ snackbarMsg })
  handleSnackbarClose = () => this.setState({ snackbarMsg: '' })

  handleMenuOpen = ({ currentTarget }) => this.setState({ anchorEl: currentTarget })
  handleMenuClose = () => this.setState({ anchorEl: null })

  handleReorderDialogOpen = () => this.setState({ openReorderDialog: true, anchorEl: null })
  handleReorderDialogClose = () => this.setState({ openReorderDialog: false })

  handleEditDialogOpen = () => this.setState({ editDialogOpen: true, anchorEl: null })
  handleEditDialogClose = () => this.setState({ editDialogOpen: false })

  handleDuplicateDialogOpen = () => this.setState({ duplicateDialogOpen: true, anchorEl: null })
  handleDuplicateDialogClose = () => this.setState({ duplicateDialogOpen: false })

  getSocialLevel = async id => {
    const res = (await axios.get(`${BACKEND_API}/levels/user/${id}`)).data
    this.setState({
      socialLevelColor: levelColors[res.quantile]
    })
  }

  handleChange = (e, newTab) => {
    this.setState({ activeTab: newTab })
  }

  isValidHttpUrl (string) {
    let url
    try {
      url = new URL(string)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  render () {
    const { classes, account, levels, dispatch, tour, theme } = this.props
    const {
      collection,
      posts,
      isLoading,
      isMinimize,
      snackbarMsg,
      recommended,
      activeTab,
      anchorEl,
      socialLevelColor,
      openReorderDialog,
      editDialogOpen,
      duplicateDialogOpen,
      recommendedLoading
    } = this.state
    let color = socialLevelColor
    const menuOpen = Boolean(anchorEl)

    if (account && account.name) {
      if (!levels[account.name]) {
        dispatch(fetchSocialLevel(account.name))
      }
      if (levels[account.name] && !levels[account.name].isLoading) {
        color = levelColors[levels[account.name].levelInfo.quantile]
      }
    }

    const hidden = isMinimize ? classes.hidden : null
    const minimize = isMinimize ? classes.minimize : null
    const minimizeHeader = isMinimize ? classes.minimizeHeader : null
    // const isLoggedUserCollection =
    //   (account && account.name) === (collection && collection.ownerId)

    const len = posts.length - 1

    let headerImgSrc =
      posts &&
      ((posts[len] && posts[len].previewData && posts[len].previewData.img) ||
        (posts[len - 1] && posts[len - 1].previewData && posts[len - 1].previewData.img))

    if (!isLoading && !collection) {
      return (
        <ErrorBoundary>
          <div className={classes.container}>
            <Grid container
              direction='column'
              className={classes.page}
            >
              <Grid
                container
                direction='column'
                spacing={5}
                style={{ width: '50%', margin: 'auto', alignItems: 'center' }}
              >
                <Grid item>
                  <Typography
                    className={classes.accountErrorHeader}
                    color='#ffffff'
                    variant='h3'
                  >
                    <strong>Sorry this page is not available.</strong>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    className={classes.accountErrorSub}
                    color='#ffffff'
                    variant='h4'
                  >
                    The page you're looking for does not exist.
                  </Typography>
                </Grid>
                <Grid item>
                  <YupButton size='large'
                    variant='outlined'
                    color='secondary'
                    href='/'
                  >Go Home</YupButton>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </ErrorBoundary>
      )
    }

    if (isLoading) {
      return (
        <div
          style={{
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
          <meta property='twitter:card'
            content='summary_large_image'
          />
          <meta property='twitter:site'
            content='@yup_io'
          />
          <meta
            property='twitter:title'
            content={`${collection.name} | ${collection.owner}`}
          />
          <meta
            property='twitter:image'
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
        <Menu
          id='short-menu'
          anchorEl={anchorEl}
          keepMounted
          open={menuOpen}
          onClose={this.handleMenuClose}
          PaperProps={{
            style: {
              width: '15ch'
            }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuItem dense
            onClick={this.handleEditDialogOpen}
            className={classes.menuItem}
          >
            Edit
          </MenuItem>
          {!!collection.posts.length && (
            <MenuItem dense
              onClick={this.handleReorderDialogOpen}
              className={classes.menuItem}
            >
              Reorder
            </MenuItem>
          )}
        </Menu>
        <CollectionEditDialog
          collection={collection}
          account={account}
          dialogOpen={editDialogOpen}
          handleDialogClose={this.handleEditDialogClose}
        />

        <CollectionDuplicateDialog
          collection={collection}
          account={account}
          dialogOpen={duplicateDialogOpen}
          handleDialogClose={this.handleDuplicateDialogClose}
        />
        <CollectionReorderDialog
          handleDialogClose={this.handleReorderDialogClose}
          collection={collection}
          dialogOpen={openReorderDialog}
        />
        <div className={classes.container}
          onScroll={this.handleScroll}
        >
          <Grid container
            direction='row'
            className={classes.page}
          >
            <PageHeader>
              <Grid item>
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'
                  spacing={2}
                >
                  <Grid
                    item
                    xs={12}
                    className={minimizeHeader}
                  >
                    <Grid container
                      direction='row'
                      justify='flex-start'
                      alignItems='center'
                      spacing={2}
                    >
                      <Grid
                        item
                      >
                        <Fade in
                          timeout={1000}
                        >
                          <Img
                            src={this.isValidHttpUrl(headerImgSrc) ? [headerImgSrc, DEFAULT_IMG] : DEFAULT_IMG}
                            alt='thumbnail'
                            loader={<div />}
                            className={`${classes.headerImg} ${minimize}`}
                          />
                        </Fade>
                      </Grid>
                      <Grid
                        item
                        lg={isMinimize ? 7 : 6}
                        md={isMinimize ? 7 : 6}
                        sm
                        xs
                      >
                        <Grid container
                          direction='column'
                          spacing={1}
                        >
                          <Grid item>
                            <Fade in
                              timeout={400}
                            >
                              <Typography variant='h3'
                                className={[classes.headerText, isMinimize ? classes.headerTitle : null]}
                              >
                                {collection.name}
                              </Typography>
                            </Fade>
                          </Grid>
                          <Grid item
                            style={{ display: isMinimize ? 'none' : 'inherit' }}
                          >
                            <Fade in
                              timeout={800}
                            >
                              <Typography
                                variant='subtitle1'
                                className={[classes.headerText, hidden]}
                              >
                                Curated by{' '}
                                <Link
                                  to={`/${collection.owner}`}
                                  style={{
                                    textDecoration: color
                                      ? `1px solid underline ${color}`
                                      : 'none'
                                  }}
                                  className={classes.curatedByName}
                                >
                                  {collection.owner}
                                </Link>
                              </Typography>
                            </Fade>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item
                        lg={isMinimize ? 3 : 4}
                        sm={isMinimize ? 2 : 1}
                        xs={isMinimize ? 4 : 2}
                      >
                        <Grid container
                          justify={isMinimize ? 'flex-end' : 'flex-start'}
                        >
                          <IconButton
                            aria-label='more'
                            aria-controls='long-menu'
                            aria-haspopup='true'
                            onClick={this.shareCollection}
                          >
                            <Icon className={[classes.icons, 'fa fa-share']} />
                          </IconButton>
                          <IconButton
                            aria-label='more'
                            aria-controls='long-menu'
                            aria-haspopup='true'
                            onClick={this.handleDuplicateDialogOpen}
                            className={classes.icons}
                          >
                            <Icon fontSize='small'
                              className={[classes.icons, 'fas fa-copy']}
                            />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </PageHeader>
            <Grid item
              xs={12}
            >
              <PageBody>
                <Grid
                  container
                  direction='row'
                  justify='flex-start'
                  alignItems='flex-start'
                  spacing={showTabs ? 2 : 6}
                >
                  {showTabs ? (
                    <>
                      <Grid item
                        xs={12}
                      >
                        <Tabs value={activeTab}
                          onChange={this.handleChange}
                          TabIndicatorProps={{ style: { backgroundColor: theme.palette.M50 } }}
                        >
                          <Tab label='Feed'
                            className={classes.tabs}
                          />
                          <Tab label='Recommended'
                            className={classes.tabs}
                          />
                        </Tabs>
                      </Grid>
                      <Grid item
                        xs={12}
                        tourname='CollectionPosts'
                      >
                        <TabPanel value={activeTab}
                          index={0}
                        >
                          <Feed
                            isLoading={isLoading}
                            hasMore={false}
                            classes={classes}
                            posts={posts}
                            hideInteractions
                            renderObjects
                          />
                        </TabPanel>

                        <TabPanel value={activeTab}
                          index={1}
                        >
                          {!recommendedLoading ? (recommended.map(rec => {
                            return (
                              <Grid item>
                                <RecommendedCollections
                                  classes={classes}
                                  collection={rec}
                                />
                              </Grid>
                            )
                          }))
                            : (
                              <Grid item
                                xs={7}
                                className={[classes.recommended, classes.recommendedMobile]}
                              >
                                <Skeleton variant='rect'
                                  animation='wave'
                                  className={classes.Skeleton}
                                  width={'100%'}
                                  height={70}
                                />
                                <Skeleton variant='rect'
                                  animation='wave'
                                  className={classes.Skeleton}
                                  width={'100%'}
                                  height={70}
                                />
                                <Skeleton variant='rect'
                                  animation='wave'
                                  className={classes.Skeleton}
                                  width={'100%'}
                                  height={70}
                                />
                                <Skeleton variant='rect'
                                  animation='wave'
                                  className={classes.Skeleton}
                                  width={'100%'}
                                  height={70}
                                />
                                <Skeleton variant='rect'
                                  animation='wave'
                                  className={classes.Skeleton}
                                  width={'100%'}
                                  height={70}
                                />
                              </Grid>)}
                        </TabPanel>
                      </Grid>
                  </>
                  ) : (
                  <>
                    <Grid item
                      tourname='CollectionPosts'
                      style={{ paddingTop: '48px' }}
                    >
                      <Feed
                        isLoading={isLoading}
                        hasMore={false}
                        classes={classes}
                        posts={posts}
                        hideInteractions
                        renderObjects
                      />
                    </Grid>

                    <Grid
                      item
                      md
                      sm={12}
                      className={classes.recommended}
                    >
                      <Grid
                        container
                        direction='column'
                        spacing={2}
                        tourname='RecommendedCollections'
                      >
                        <Grid item
                          xs={12}
                        >
                          <Typography variant='h5'>Recommended</Typography>
                        </Grid>
                        <Grid item
                          xs={12}
                        >
                          {!recommendedLoading ? recommended.map(rec => {
                            return (
                              <RecommendedCollections
                                classes={classes}
                                collection={rec}
                              />
                            )
                          }) : (
                            <Grid item
                              xs={12}
                            >
                              <Skeleton variant='rect'
                                animation='wave'
                                className={classes.Skeleton}
                                width={'100%'}
                                height={70}
                              />
                              <Skeleton variant='rect'
                                animation='wave'
                                className={classes.Skeleton}
                                width={'100%'}
                                height={70}
                              />
                              <Skeleton variant='rect'
                                animation='wave'
                                className={classes.Skeleton}
                                width={'100%'}
                                height={70}
                              />
                              <Skeleton variant='rect'
                                animation='wave'
                                className={classes.Skeleton}
                                width={'100%'}
                                height={70}
                              />
                              <Skeleton variant='rect'
                                animation='wave'
                                className={classes.Skeleton}
                                width={'100%'}
                                height={70}
                              />
                            </Grid>)}
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                  )}
                </Grid>
              </PageBody>
            </Grid>

            <Tour
              steps={steps}
              isOpen={tour}
              onRequestClose={() => { dispatch(setTourAction({ isTourOpen: false })) }}
              className={classes.Tour}
              accentColor='#00E08E'
              rounded={10}
              disableInteraction
              highlightedMaskClassName={classes.Mask}
              nextButton={
                <YupButton size='small'
                  variant='contained'
                  color='primary'
                >Next</YupButton>
              }
              prevButton={
                <YupButton size='small'
                  variant='contained'
                  color='primary'
                >Back</YupButton>
              }
              lastStepNextButton={<div style={{ display: 'none' }} />}
            />
            <Fab
              className={classes.tourFab}
              variant='extended'
              onClick={() => { dispatch(setTourAction({ isTourOpen: true })) }}
            >
              10-Second Tutorial
            </Fab>
            <CreateCollectionFab />
          </Grid>
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
        <Typography
          className='tourHeader'
          variant='h4'
        >📰 Collection Posts</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >These are the curated posts in this collection.</Typography>
      </div>
    )
  },
  {
    selector: '[tourName="RecommendedCollections"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📖 Recommended Collections</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >These are some other collections you should check out!</Typography>
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
        <Typography
          variant='body2'
          className='tourText'
        >These are your feeds.</Typography>
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
        <Typography
          className='tourHeader'
          variant='h4'
        >📈 Leaderboard</Typography>
        <Typography
          variant='body2'
          className='tourText'
        >Find content and users ranked by category and platform.</Typography>
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
        <Typography variant='h4'
          className='tourHeader'
        >👏 That's it!</Typography>
        <Typography variant='body2'
          className='tourText'
        >That's all for now. Learn more with some of these resources:</Typography>
        <StyledTourResources />
      </div>
    )
  }
]

Collections.propTypes = {
  dispatch: PropTypes.func.isRequired,
  levels: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  tour: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  const account = accountInfoSelector(state)

  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    push: state.scatterInstallation.push,
    collections: state.collections,
    tour: state.tour.isTourOpen
  }
}

export default connect(mapStateToProps)(withStyles(styles)(withTheme(Collections)))
