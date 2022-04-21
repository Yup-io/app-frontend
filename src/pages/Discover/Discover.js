import React, { Component, memo } from 'react'
import HomeMenu from '../../components/Landing/HomeMenu'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import withStyles from '@mui/styles/withStyles'
import { Grid, Fab, Button, Typography, Fade } from '@mui/material'
import FeedHOC from '../../components/Feed/FeedHOC'
import { Helmet } from 'react-helmet'
import Tooltip from '@mui/material/Tooltip'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import './discover.css'
import isEqual from 'lodash/isEqual'
import ReactPlayer from 'react-player'
import CreateCollectionFab from '../../components/Miscellaneous/CreateCollectionFab.js'
import { setTourAction } from '../../redux/actions'

const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'

const styles = theme => ({
  container: {
    minHeight: '100vh',
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
    backgroundColor: theme.palette.alt.second
  },
  page: {
    width: '100%',
    marginLeft: 0,
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    },
    [theme.breakpoints.down('sm')]: {
      backgroundSize: 'contain'
    },
    flex: 1
  },
  sideFeed: {
    position: 'fixed',
    marginLeft: '38vw',
    paddingLeft: '0px',
    paddingRight: '0px'
  },
  feedWrapper: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginLeft: '0%',
      padding: '0%'
    }
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important',
    backgroundColor: `${theme.palette.alt.third} !important`
  },
  tourFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    color: theme.palette.common.third,
    zIndex: '1000',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  hideOnMobile: {
    display: 'inherit',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  }
})

function feedMetaTitle (feed) {
  switch (feed) {
  case 'dailyhits':
    return 'Daily Hits • Yup'
  case 'lol':
    return 'LOL • Yup'
  case 'brainfood':
    return 'Smart • Yup'
  case 'latenightcool':
    return 'Popular • Yup'
  case 'politics':
    return 'The Race • Yup'
  case 'non-corona':
    return 'Safe Space • Yup'
  case 'crypto':
    return 'Crypto • Yup'
  case 'nfts':
    return 'NFTs • Yup'
  case 'mirror':
    return 'Mirror Feed'
  default:
    return 'Yup • Social Network for Curators'
  }
}

function feedDescription (feed) {
  switch (feed) {
  case 'dailyhits':
    return 'Top content of the day based on general influence'
  case 'lol':
    return 'Top content based on the funny category '
  case 'brainfood':
    return 'Top content based on the smart category'
  case 'latenightcool':
    return 'Top content based on the like category'
  case 'politics':
    return 'Top content related to current politics'
  case 'non-corona':
    return 'A feed free from virus-related content. Providing clarity and well-being in hard and confusing times.'
  case 'crypto':
    return 'The top crypto content out there'
  case 'nfts':
    return 'Non-fungibility for days'
  case 'mirror':
    return 'Live feed of the best articles across all Mirror publications'
  default:
    return 'Yup • Social Layer for the Internet'
  }
}

function feedImg (feed) {
  switch (feed) {
  case 'mirror':
    return 'mirror-meta.jpg'
  default:
    return 'main-meta.jpg'
  }
}

function FeedContainer ({ classes, feed, headerWidth, query, isMinimize }) {
  const metaTitle = feedMetaTitle(query.feed)
  const feedDesc = feedDescription(query.feed)
  const metaImg = feedImg(query.feed)
  return (
    <ErrorBoundary>
      <div id='feedTitleContainer'
        className={classes.feed}
      >
        <Helmet>
          <meta charSet='utf-8' />
          <title> {metaTitle} </title>
          <meta property='description'
            content={feedDesc}
          />
          <meta property='image'
            content={`${process.env.APP_META_IMAGES}/${metaImg}`}
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
            content={feedDesc}
          />
          <meta
            name='twitter:image'
            content={`${process.env.APP_META_IMAGES}/${metaImg}`}
          />
          <meta
            property='og:title'
            content={metaTitle}
          />
          <meta
            property='og:description'
            content={feedDesc}
          />
          <meta property='og:image'
            content={metaImg}
          />
        </Helmet>
        <Grid container
          direction='column'
          justifyContent='center'
        >
          <Grid container>
            <StyledFeedHeader
              description={feedDesc}
              headerWidth={headerWidth}
              image={`images/feeds/${FEED_HEADERS[feed]}`}
              name={`${FEED_NAMES[feed]}`}
              isMinimize={isMinimize}
            />
          </Grid>
          <Grid justifyContent='center'
            container
          >
            <FeedHOC feed={feed} />
          </Grid>
        </Grid>
      </div>
    </ErrorBoundary>
  )
}

FeedContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  headerWidth: PropTypes.string,
  feed: PropTypes.string.isRequired,
  query: PropTypes.object.isRequired,
  isMinimize: PropTypes.bool.isRequired
}

const StyledFeedContainer = withStyles(theme => ({
  feed: {
    height: '100vh',
    overflowY: 'hidden',
    fontFamily: 'Gilroy',
    margin: '0 auto',
    width: '100%',
    fontSize: '20px',
    color: theme.palette.common.first
  }
}))(FeedContainer)

const FEED_HEADERS = {
  dailyhits: 'dailyhitscover.png',
  brainfood: 'smartcover.png',
  lol: 'lolcover.png',
  latenightcool: 'popularcover.png',
  politics: 'politicscover.png',
  'non-corona': 'safecover.png',
  crypto: 'cryptocover.png',
  nfts: 'nftcover.png',
  new: 'dailyhitscover.png',
  mirror: 'mirrorcover.png'
}

const FEED_NAMES = {
  dailyhits: 'Your Daily Hits',
  brainfood: 'Smart',
  lol: 'Funny',
  latenightcool: 'Popular',
  politics: 'Politics',
  'non-corona': 'Safe Space',
  crypto: 'Crypto',
  nfts: 'NFT Gallery',
  new: 'New',
  mirror: 'Mirror Articles'
}

function FeedHeader ({
  classes,
  headerWidth,
  image,
  name,
  description,
  isMinimize
}) {
  return (
    <div className={classes.topicDiv}
      style={{ paddingBottom: isMinimize ? '20px' : '' }}
    >
      <Tooltip
        placement='bottom'
        disableTouchListener
        title={
          <Typography variant='tooltip'>
            {' '}
            {description}{' '}
          </Typography>
        }
      >
        <Grid
          container
          direction='row'
          spacing={2}
          justifyContent='flex-start'
          alignItems='center'
        >
          <Grid
            item
            xs={isMinimize ? 1 : 2}
          >
            <img
              className={classes.topicImg}
              src={image}
              alt={name}
            />
          </Grid>
          <Grid item>
            <Typography
              variant={isMinimize ? 'h2' : 'h3'}
              style={isMinimize ? { fontSize: '1rem' } : {}}
            >
              {name}
            </Typography>
          </Grid>
        </Grid>
      </Tooltip>
    </div>
  )
}

FeedHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  headerWidth: PropTypes.string,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isMinimize: PropTypes.bool.isRequired
}

const StyledFeedHeader = withStyles(theme => ({
  topicDiv: {
    background: 'transparent',
    zIndex: 100,
    width: '600px',
    margin: '0 auto',
    position: 'relative',
    padding: '80px 0px 35px 0px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0',
      padding: '70px 0px 25px 15px',
      width: '100vw'
    }
  },
  topicImg: {
    zIndex: 100,
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '15%',
    display: 'block'
  }
}))(FeedHeader)

class Discover extends Component {
  state = {
    isTourOpen: false,
    isMinimize: false,
    showTour: true
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

  closeTour = () => {
    if (window.location.search.includes('tutorial=true')) {
      window.location.search = window.location.search.replace(
        '&?tutorial=true',
        ''
      )
    }
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        showTour: false
      })
    }, 30000)
  }

  render () {
    const { classes, feed, query, dispatch, tour } = this.props
    const search = document.location.search
    return !search.includes('feed=') ? (
      <HomeMenu />
    ) : (
      <div className={classes.container}>
        <div className={classes.page}>
          <Grid container
            justifyContent='center'
          >
            <Grid
              className={classes.feedWrapper}
              item
              width='100%'
              onScroll={this.handleScroll}
            >
              <StyledFeedContainer
                query={query}
                headerWidth={classes.page.width}
                feed={feed}
                isMinimize={this.state.isMinimize}
              />
            </Grid>
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
              <Button
                variant='outlined'
                small
              >
                Next
              </Button>
            }
            prevButton={
              <Button
                small
                variant='outlined'
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
              onClick={() => { dispatch(setTourAction({ isTourOpen: true })) }}
            >
              10-Second Tutorial
            </Fab>
          </Fade>
          <CreateCollectionFab />
        </div>
      </div>
    )
  }
}

const steps = [
  {
    selector: '[tourName="ProfileFeed"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >📰 User Feed</Typography>
        <p className='tourText'>
          This is the content across the web, aggregated into a feed just for
          you.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="Rating"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >🤔 Rating</Typography>
        <p className='tourText'>
          You can rate content out of 5 in different categories, such as like
          ♥️, smart 💡, funny 😂, etc.
        </p>
        <a
          href='https://docs.yup.io/basic/rating'
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

const mapStateToProps = state => {
  const { router } = state
  return {
    feed: router.location.query.feed || state.homeFeed.feed,
    query: router.location.query,
    tour: state.tour.isTourOpen
  }
}

Discover.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  feed: PropTypes.string,
  query: PropTypes.object.isRequired,
  tour: PropTypes.object.isRequired
}

export default memo(connect(mapStateToProps)(withStyles(styles)(Discover)))
