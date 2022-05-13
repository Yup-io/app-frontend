import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Feed from '../../components/Feed/Feed'
import withStyles from '@mui/styles/withStyles'
import { Fab, Typography, Grid, Tabs, Tab } from '@mui/material'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Link from 'next/link'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.module.css'
import StyledTourResources from '../../components/Tour/StyledTourResources'
import Fade from '@mui/material/Fade'
import UserAvatar from '../../components/UserAvatar/UserAvatar'
import { RecommendedCollections } from '../../components/Collections'
import { YupButton, ResponsiveEllipsis } from '../../components/Miscellaneous'
import { PageBody } from '../pageLayouts'

const DISPLAYED_USERS = 2
const showTabs = window.innerWidth <= 960

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '75px 0 0 20px',
    minHeight: 'calc(100vh - 75px)',
    width: '100vw',
    overflowX: 'hidden',
    [theme.breakpoints.down('md')]: {
      margin: 0
    }
  },
  feedContainer: {
    [theme.breakpoints.up('1700')]: {
      width: '100%'
    },
    [theme.breakpoints.down('xl')]: {
      width: '100%'
    }
  },
  feedPage: {
    height: '800px',
    minHeight: '800px',
    marginLeft: '-5px',
    [theme.breakpoints.down('xl')]: {
      marginLeft: 0,
      width: '100%',
      height: '100%'
    }
  },
  feedLoader: {
    margin: 0,
    width: '600px',
    [theme.breakpoints.down('xl')]: {
      marginLeft: 0
    }
  },
  resultsContainer: {
    maxWidth: '100%',
    [theme.breakpoints.down('md')]: {
      margin: '65px 0 0 5px'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  page: {
    flex: 1,
    width: '100%',
    marginLeft: 0,
    [theme.breakpoints.down('xl')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.down('md')]: {
      backgroundSize: 'contain',
      overflowX: 'hidden'
    }
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
    [theme.breakpoints.down('xl')]: {
      display: 'none'
    }
  },
  headerText: {
    fontWeight: 300,
    marginBottom: '15px',
    [theme.breakpoints.down('md')]: {
      marginBottom: '10px'
    }
  },
  peopleContainer: {
    width: '80%',
    display: 'inline-block',
    padding: '10px 0',
    [theme.breakpoints.down('xl')]: {
      width: '85%'
    },
    [theme.breakpoints.down('md')]: {
      width: '90%',
      padding: 0,
      overflow: 'auto',
      whiteSpace: 'nowrap'
    }
  },
  people: {
    borderRadius: 10,
    display: 'inline-block',
    padding: '10px 0',
    width: '500px',
    '&:hover': {
      background: '#fafafa05'
    },
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      padding: '5px 0 0 0'
    }
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '100%',
    [theme.breakpoints.down('xl')]: {
      width: '50px',
      height: '50px'
    },
    [theme.breakpoints.down('md')]: {
      width: '40px',
      height: '40px'
    }
  },
  user: {
    width: '300px',
    padding: '0 10px',
    [theme.breakpoints.down('xl')]: {
      width: '275px'
    },
    [theme.breakpoints.down('md')]: {
      width: '250px'
    }
  },
  article: {
    maxWidth: '600px'
  },
  tabs: {
    fontSize: '1.2rem',
    textTransform: 'capitalize'
  }
})

const User = ({ classes, user }) => {
  return (
    <Link className={classes.people}
      key={user._id}
      href={`/${user.username || user._id}`}
      style={{ textDecoration: 'none' }}
    >
      <Grid container
        direction='row'
        justifyContent='flex-start'
        alignItems='center'
        className={classes.user}
        spacing={4}
      >
        <Grid item
          md={4}
          xs={3}
        >
          <UserAvatar className={classes.avatar}
            src={user.avatar}
            username={user.username}
            alt='avatar'
          />
        </Grid>
        <Grid item
          md={8}
          xs={9}
          style={{ marginBottom: '8px' }}
        >
          <Typography variant='body1'>
            <strong>
              <ResponsiveEllipsis
                basedOn='letters'
                ellipsis='...'
                maxLine='2'
                text={user.fullname || user._id || user.username}
                trimRight
              />
            </strong>
          </Typography>
          <Typography variant='body1'>
            @{user.username || user.eosname}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  )
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const People = (props) => {
  const { classes, people } = props

  return (
    <Grid container
      direction='row'
      justifyContent='center'
      alignItems='center'
      spacing={2}
      className={classes.peopleContainer}
    >
      {/* TODO: need better way to display users in three rows */}
      <Grid item>
        {
          people.slice(0, DISPLAYED_USERS).map((user) => (
            <User classes={classes}
              user={user}
            />
          ))
        }
      </Grid>
      <Grid item>
        {
          people.slice(DISPLAYED_USERS, DISPLAYED_USERS + DISPLAYED_USERS).map((user) => (
            <User classes={classes}
              user={user}
            />
          ))
        }
      </Grid>
      <Grid item>
        {
          people.slice(DISPLAYED_USERS + DISPLAYED_USERS).map((user) => (
            <User classes={classes}
              user={user}
            />
          ))
        }
      </Grid>
    </Grid>
  )
}

People.propTypes = {
  classes: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired
}

function TabPanel (props) {
  const { children, value, index } = props

  return (
    <Grid
      role='tabpanel'
      hidden={value !== index}
      sx={{ maxWidth: '100%' }}
    >
      {value === index && (
        <Grid>{children}</Grid>
      )}
    </Grid>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

class Search extends Component {
  state = {
    showTour: true,
    isTourOpen: false,
    activeTab: 0
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
    const { classes, postSearchResults, userSearchResults, collectionSearchResults } = this.props
    const { activeTab } = this.state
    const { posts, searchText, isLoading } = postSearchResults
    const { users } = userSearchResults
    const { collections } = collectionSearchResults

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <PageBody pageClass={classes.page}>
            <Fade in
              timeout={1000}
            >
              <Grid container
                direction='row'
                justifyContent='flex-start'
                alignItems='flex-start'
                spacing={4}
                className={classes.resultsContainer}
              >
                <Grid item
                  xs={12}
                >
                  <Typography variant='body1'>
                    Results for "{searchText}"
                  </Typography>
                </Grid>

                {!isLoading && posts.length === 0 && users.length === 0 && collections.length === 0 &&
                  <Grid item
                    xs={12}
                    style={{ height: '100%' }}
                  >
                    <Typography
                      variant='h5'
                      className={classes.headerText}
                      style={{ textAlign: 'center' }}
                    >
                      Try searching for posts, users, or keywords
                    </Typography>
                  </Grid>
                }

                {showTabs && (posts.length > 0 || users.length > 0 || collections.length > 0) &&
                  <>
                    <Grid item
                      xs={12}
                    >
                      <Tabs value={activeTab}
                        onChange={this.handleChange}
                        TabIndicatorProps={{ style: { backgroundColor: '#fff' } }}
                      >
                        <Tab label='Posts' />
                        <Tab label='People' />
                        <Tab label='Collections' />
                      </Tabs>
                    </Grid>

                    <TabPanel value={activeTab}
                      index={0}
                    >
                      <Grid item
                        xs={12}
                        className={classes.feedContainer}
                      >
                        <Feed isLoading={isLoading}
                          hasMore
                          classes={classes}
                          posts={posts}
                          hideInteractions
                        />
                      </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab}
                      index={1}
                    >
                      <Grid item
                        xs={12}
                      >
                        <People classes={classes}
                          people={users}
                        />
                      </Grid>
                    </TabPanel>

                    <TabPanel value={activeTab}
                      index={2}
                    >
                      <Grid item
                        xs={12}
                      >
                        {collections.map(rec => {
                          return (
                            <RecommendedCollections
                              classes={classes}
                              collection={rec}
                            />
                          )
                        })}
                      </Grid>
                    </TabPanel>
                  </>
                }

                {!showTabs && (posts.length > 0 || users.length > 0 || collections.length > 0) &&
                  <>
                    <Grid item
                      lg={!isLoading && users.length === 0 ? 12 : 7}
                      md={!isLoading && users.length === 0 ? 12 : 8}
                      xs={12}
                      tourname='SearchPosts'
                      style={{ display: !isLoading && posts.length === 0 ? 'none' : '' }}
                    >
                      <Typography
                        variant='h5'
                        className={classes.headerText}
                      >
                        Posts
                      </Typography>
                      <Feed isLoading={isLoading}
                        hasMore
                        classes={classes}
                        posts={posts}
                        hideInteractions
                      />
                    </Grid>
                    <Grid container
                      direction='column'
                      item
                      lg={!isLoading && posts.length === 0 ? 12 : 5}
                      md={!isLoading && posts.length === 0 ? 12 : 4}
                      xs={12}
                      tourname='SearchUsers'
                      style={{ display: users.length === 0 ? 'none' : 'inherit' }}
                    >
                      <Grid item
                        xs={12}
                      >
                        <Typography
                          variant='h5'
                          className={classes.headerText}
                        >
                          People
                        </Typography>
                        <People classes={classes}
                          people={users}
                        />
                      </Grid>
                      <Grid item
                        direction='column'
                        xs={12}
                        tourname='collections'
                        style={{ display: collections.length === 0 ? 'none' : 'inherit' }}
                      >
                        <Typography
                          variant='h5'
                          className={classes.headerText}
                        >
                          Collections
                        </Typography>
                        {collections.map(rec => {
                          return (
                            <RecommendedCollections
                              classes={classes}
                              collection={rec}
                            />
                          )
                        })}
                      </Grid>
                    </Grid>
                  </>
                }
              </Grid>
            </Fade>

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
          </PageBody>
        </div>
      </ErrorBoundary>
    )
  }
}

const steps = [
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          🔍  Search
        </Typography>
        <p className='tourText'>
          Search for users and elevant posts across the web.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="SearchPosts"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          📰  Posts
        </Typography>
        <p className='tourText'>
          These are your search results for posts.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="SearchUsers"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          👥  Users
        </Typography>
        <p className='tourText'>
          These are the search results for users.
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
        >
          📡  Feeds
        </Typography>
        <p className='tourText'>
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
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          📈  Leaderboard
        </Typography>
        <p className='tourText'>
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
        <Typography className='tourHeader'
          variant='h3'
        >
          👏 That's it !
        </Typography>
        <p className='tourText'>
          That's all for now. Learn more with some of these resources:
        </p>
        <StyledTourResources />
      </div>
    )
  }
]

const mapStateToProps = (state) => {
  return {
    userSearchResults: state.searchResults.userSearchResults, // userSearchResultsSelector(state),
    postSearchResults: state.searchResults.postSearchResults, // postSearchResultsSelector(state)
    collectionSearchResults: state.searchResults.collectionSearchResults // postSearchResultsSelector(state)
  }
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  userSearchResults: PropTypes.object.isRequired,
  postSearchResults: PropTypes.object.isRequired,
  collectionSearchResults: PropTypes.object.isRequired
}

Search.defaultProps = {
  userSearchResults: {
    isLoading: false,
    error: null,
    searchText: '',
    users: []
  },
  postSearchResults: {
    isLoading: false,
    searchText: '',
    error: null,
    posts: []
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Search))
