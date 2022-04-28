import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import withTheme from '@mui/styles/withTheme'
import { Grid, Typography, Fade, Grow, Card, CardContent, CardActions } from '@mui/material'
import '../../components/Twitter/twitter.css'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Tilt from 'react-tilt'
import { Link } from 'react-router-dom'
import '../../pages/Discover/discover.css'
import axios from 'axios'
import { Mono } from '../../utils/colors.js'
import Img from 'react-image'
import { accountInfoSelector } from '../../redux/selectors'
import HomeMenuLinkItem from './HomeMenuLinkItem'
import { connect } from 'react-redux'
import { YupButton } from '../Miscellaneous'
import { PageBody } from '../../pages/pageLayouts'

const { BACKEND_API, YUP_LANDING, WEB_APP_URL } = process.env
const isMobile = window.innerWidth <= 600
const AWS_DEFAULT_COLLECTION_IMG_URLS = [...Array(5)].map(
  (_, i) => `https://app-gradients.s3.amazonaws.com/gradient${i + 1}.png`
)
const getRandomGradientImg = () => `${AWS_DEFAULT_COLLECTION_IMG_URLS[Math.floor(Math.random() * AWS_DEFAULT_COLLECTION_IMG_URLS.length)]}`

const styles = theme => ({
  container: {
    overflowX: 'hidden',
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100vw - 190px)`
    },
    [theme.breakpoints.down('sm')]: {
      backgroundSize: 'contain'
    }
  },
  link: {
    textDecoration: 'none'
  },
  page: {
    zIndex: 1,
    paddingTop: 100,
    minHeight: '100vh',
    minWidth: '100vw',
    maxWidth: '100vw',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0
    }
  },
  linkItemContainer: {
    alignContent: 'center',
    height: '100%'
  },
  imageCard: {
    borderRadius: '0.5rem',
    width: '100%',
    aspectRatio: '1 / 1',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: theme.spacing(1),
    backgroundSize: 'cover',
    transition: '0.3s box-shadow !important',
    '&:hover': {
      boxShadow: `0px 0px 40px ${theme.palette.M50}30`
    }
  },
  imageCardGrid: {
    aspectRatio: '1 / 1'
  },
  recommendedImg: {
    height: '60px',
    width: '60px',
    objectFit: 'cover',
    marginTop: '10px',
    borderRadius: '5px',
    [theme.breakpoints.down('lg')]: {
      height: '50px',
      width: '50px'
    },
    [theme.breakpoints.down('sm')]: {
      height: '30px',
      width: '30px'
    }
  },
  recommendedContainer: {
    borderRadius: 10,
    margin: '5px 0px',
    '&:hover': {
      background: `${theme.palette.M500}10`
    }
  },
  recommendedImgContainer: {
    flexBasis: 'unset'
  },
  banner: {
    position: 'relative',
    zIndex: -10,
    width: '150vw',
    marginLeft: `-25vw`,
    marginBottom: theme.spacing(-42),
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(-3)
    }
  },
  bannerBg: {
    width: '100%',
    height: theme.spacing(48),
    backgroundSize: 'cover',
    backgroundImage: `linear-gradient(to top, ${theme.palette.M900}, ${theme.palette.M900}cc),
url('images/feeds/rainbowbanner.svg')`,
    [theme.breakpoints.down('sm')]: {
      backgroundSize: 'auto'
    }
  },
  bannerCard: {
    height: '100%',
    backgroundSize: 'cover',
    backdropFilter: 'blur(10px)',
    padding: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(0.5)
    },
    overflow: 'visible'
  },
  bannerMediaUser: {
    maxWidth: '40%',
    maxHeight: 190,
    bottom: '16px',
    right: '16px',
    position: 'absolute'
  },
  bannerMediaNews: {
    maxWidth: '40%',
    maxHeight: '130%',
    top: '-40px',
    right: 0,
    position: 'absolute'
  },
  titlePlain: {
    paddingBottom: theme.spacing(1),
    fontSize: theme.spacing(8),
    color: theme.palette.M50,
    lineHeight: theme.spacing(8),
    textShadow: `0px 0px 40px ${theme.palette.M900}33`,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(4),
      lineHeight: theme.spacing(4)
    }
  },
  subtitle: {
    color: theme.palette.M50
  }
})

class Home extends Component {
  state = {
    linkItems: [],
    cardItems: [],
    recommendedCollections: []
  }
  componentDidMount () {
    this.fetchHomeConfig()
  }

  fetchHomeConfig () {
    axios
      .get(`${BACKEND_API}/home-config/v2`)
      .then(({ data: { cardItems, linkItems } }) => {
        this.setState({ linkItems, cardItems })
      })
    axios
      .get(`${BACKEND_API}/collections/recommended?limit=7`)
      .then(({ data: recommendedCollections }) => {
        this.setState({ recommendedCollections })
      })
  }

  render () {
    const { classes, isUser, userCollections, theme } = this.props
    const { linkItems, cardItems, recommendedCollections } = this.state

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <PageBody pageClass={classes.page}>
            <Grid
              className={classes.gridContainer}
              container
              direction='row'
              justifyContent='flex-start'
              rowSpacing={5}
              alignItems='stretch'
            >
              <Grid item
                xs={12}
              >
                <Grid
                  container
                  direction='row'
                  spacing={3}
                  alignItems='stretch'
                >
                  <Grid item
                    md={12}
                    xs={12}
                  >
                    <Fade in
                      timeout={300}
                    >
                      <Card
                        elevation={0}
                        className={classes.bannerCard}
                        style={{ backgroundImage: isUser ? `linear-gradient(to top, ${theme.palette.M500}, ${theme.palette.M600})` : "url('images/feeds/rainbowbanner.svg')" }}
                      >
                        <CardContent>
                          <Grid
                            container
                            direction='row'
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <Grid item
                              xs={isMobile ? 12 : 7}
                            >
                              <Typography
                                variant='h1'
                                className={classes.titlePlain}
                              >
                                {isUser
                                  ? `Mirror Feed`
                                  : `Social Network for Curators`}
                              </Typography>
                              <Typography
                                variant='subtitle1'
                                className={classes.subtitle}
                              >
                                {isUser
                                  ? `Explore Mirror articles from all publications, all in one feed`
                                  : `Curate and share content across the web. Earn money and clout for your taste`}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              container
                              justifyContent='center'
                              xs={5}
                              style={{ display: isMobile ? 'none' : 'inherit' }}
                            >
                              <Img
                                className={
                                  isUser
                                    ? classes.bannerMediaUser
                                    : classes.bannerMediaNews
                                }
                                src={
                                  isUser
                                    ? 'images/graphics/mirrorgraphic.png'
                                    : 'images/graphics/coingraphic.png'
                                }
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions>
                          {isUser
                            ? <Link className={classes.link}
                              to={'/?feed=mirror'}
                            >
                              <YupButton size='large'
                                variant='contained'
                                color='primary'
                              >Enter</YupButton>
                            </Link>
                            : <>
                                  <a className={classes.link}
                                    href={`${WEB_APP_URL}/?signupOpen=true`}
                                  >
                                    <YupButton size='large'
                                      variant='contained'
                                      color='primary'
                                    >Start Now</YupButton>
                                  </a>
                                  <a className={classes.link}
                                    href={YUP_LANDING}
                                    target='_blank'
                                  >
                                    <YupButton size='large'
                                      variant='outlined'
                                      color='secondary'
                                    >Learn More</YupButton>
                                  </a>
                                </>
                          }
                        </CardActions>
                      </Card>
                    </Fade>
                  </Grid>
                  {linkItems &&
                    linkItems.map(
                      ({ title, link, onlyVisibleToLoggedUser }) => {
                        if (!isUser && onlyVisibleToLoggedUser) {
                          return
                        }
                        return (
                          <HomeMenuLinkItem
                            title={title}
                            link={link.replace('USER_PLACEHOLDER', isUser)}
                          />
                        )
                      }
                    )}
                </Grid>
              </Grid>
              <Grid item
                xs={12}>
                <Grid
                  container
                  direction='row'
                  spacing={3}
                  className={classes.ItemsContainer}
                  alignItems='flex-start'
                >
                  {cardItems &&
                    cardItems.map((item, index) => {
                      return (
                        <Grid
                          item
                          key={index}
                          xs={6}
                          sm={3}
                          className={classes.imageCardGrid}
                        >
                          <Link to={item.link}
                            className={classes.link}
                          >
                            <Grow in
                              timeout={500}
                            >
                              <Grid
                                container
                                direction='column'
                                alignItems='stretch'
                                spacing={1}
                              >
                                <Grid item>
                                  <Tilt
                                    options={{
                                      max: 10,
                                      scale: 1.1,
                                      perspective: 2000
                                    }}
                                  >
                                    <Card
                                      elevation={0}
                                      style={{
                                        backgroundImage: `url(${item.imgSrc})`
                                      }}
                                      alt={item.title}
                                      className={classes.imageCard}
                                    >
                                      <Typography
                                        variant='h5'
                                        style={{ color: Mono.M50 }}
                                      >
                                        {item.title}
                                      </Typography>
                                    </Card>
                                  </Tilt>
                                </Grid>
                              </Grid>
                            </Grow>
                          </Link>
                        </Grid>
                      )
                    })}
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: isUser ? 'inherit' : 'none' }}
              >
                <Grid
                  container
                  direction='row'
                >
                  <Grid item
                    xs={12}
                  >
                    <Fade in
                      timeout={2000}
                    >
                      <Typography variant='h5'>Your Collections</Typography>
                    </Fade>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <Grid
                      container
                      spacing={3}
                      className={classes.ItemsContainer}
                    >
                      {userCollections &&
                    userCollections.slice(0, 8).map(coll => {
                      return (
                        <Grid
                          item
                          xs={6}
                          sm={4}
                          md={3}
                          className={classes.linkItemContainer}
                        >
                          <Link
                            to={`/collections/${encodeURIComponent(
                              coll.name.replace(/\s+|\//g, '-').toLowerCase()
                            )}/${coll._id}`}
                            className={classes.link}
                          >
                            <Grid
                              container
                              direction='row'
                              justifyContent='flex-start'
                              alignItems='center'
                              className={classes.recommendedContainer}
                            >
                              <Grid
                                item
                                xs={4}
                                lg={4}
                                xl={4}
                                p={1}
                                className={classes.recommendedImgContainer}
                              >
                                <Img
                                  src={[coll.imgSrcUrl, getRandomGradientImg()]}
                                  alt='thumbnail'
                                  className={classes.recommendedImg}
                                />
                              </Grid>
                              <Grid item
                                xs={8}
                                lg={8}
                                xl={8}
                                p={1}
                              >
                                <Typography variant='subtitle1'>
                                  {coll.name}
                                </Typography>
                                <Typography variant='body2'>
                                  {coll.postIds.length === 1
                                    ? `1 post`
                                    : `${coll.postIds.length} posts`}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Link>
                        </Grid>
                      )
                    })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item
                xs={12}>
                <Grid container
                  direction='column'
                >
                  <Grid
                    item
                    xs={12}
                  >
                    <Grid
                      container
                      spacing={3}
                      className={classes.ItemsContainer}
                    >
                      <Grid item
                        xs={12}
                      >
                        <Fade in
                          timeout={2000}
                        >
                          <Typography variant='h5'>Browse</Typography>
                        </Fade>
                      </Grid>
                      {recommendedCollections &&
                      recommendedCollections.map(coll => {
                        if (!coll) return null
                        return (
                          <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            className={classes.linkItemContainer}
                          >
                            <Link
                              to={`/collections/${encodeURIComponent(
                                coll.name.replace('/', '')
                              )}/${coll._id}`}
                              className={classes.link}
                            >
                              <Grid
                                container
                                direction='row'
                                justifyContent='flex-start'
                                alignItems='center'
                                className={classes.recommendedContainer}
                              >
                                <Grid
                                  item
                                  xs={4}
                                  lg={4}
                                  xl={4}
                                  p={1}
                                  className={classes.recommendedImgContainer}
                                >
                                  <Img
                                    src={[
                                      coll.imgSrcUrl,
                                      getRandomGradientImg()
                                    ]}
                                    alt='thumbnail'
                                    className={classes.recommendedImg}
                                  />
                                </Grid>
                                <Grid item
                                  xs={8}
                                  lg={8}
                                  xl={8}
                                  p={1}
                                >
                                  <Typography variant='subtitle1'>
                                    {coll.name}
                                  </Typography>
                                  <Typography variant='body2'>
                                    {coll.owner}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Link>
                          </Grid>
                        )
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </PageBody>
        </div>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  const account = accountInfoSelector(state)
  const isUser = account && account.name
  // const accountNotLoaded = state.authInfo.isLoading || (state.authInfo.error && !state.authInfo.isLoading)
  // const cachedUsername = localStorage.getItem('cachedUsername')

  // const isUser = accountNotLoaded ? cachedUsername : accountName

  // if (!cachedUsername && account.name) {
  //   localStorage.setItem('cachedUsername', JSON.stringify(account.name))
  // }
  const { collections: userCollections } =
    state.userCollections[account && account.name] || {}
  return {
    isUser,
    userCollections
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  userCollections: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  isUser: PropTypes.bool.isRequired
}

export default memo(
  connect(mapStateToProps)(withStyles(styles)(withTheme(Home)))
)
