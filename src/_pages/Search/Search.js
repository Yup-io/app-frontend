import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Feed from '../../components/Feed/Feed';
import withStyles from '@mui/styles/withStyles';
import { Typography, Grid, Tabs, Tab } from '@mui/material';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Link from 'next/link';
import Fade from '@mui/material/Fade';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import { RecommendedCollections } from '../../components/Collections';
import { PageBody } from '../pageLayouts';
import { windowExists } from '../../utils/helpers';

const styles = (theme) => ({
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
  userContainer: {
    borderRadius: 10,
    margin: '5px 0',
    cursor: 'pointer',
    '&:hover': {
      background: '#fafafa05'
    }
  },
  article: {
    maxWidth: '600px'
  },
  tabs: {
    fontSize: '1.2rem',
    textTransform: 'capitalize'
  }
});

const User = ({ classes, user }) => {
  return (
    <Link
      key={user._id}
      href={`/account/${user.username || user._id}`}
      style={{ textDecoration: 'none' }}
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        className={classes.userContainer}
      >
        <Grid item xs={4.5} lg={2.5} p={1}>
          <UserAvatar
            className={classes.avatar}
            src={user.avatar}
            username={user.username}
            alt="avatar"
          />
        </Grid>
        <Grid item xs={7.5} lg={9.5} p={1}>
          <Typography noWrap variant="body1">
            <strong>{user.fullname || user._id || user.username}</strong>
          </Typography>
          <Typography noWrap variant="body2">
            @{user.username || user.eosname}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  );
};

User.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const People = (props) => {
  const { classes, people } = props;

  return (
    <>
      {people.map((user) => (
        <User classes={classes} user={user} />
      ))}
    </>
  );
};

People.propTypes = {
  classes: PropTypes.object.isRequired,
  people: PropTypes.array.isRequired
};

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <Grid role="tabpanel" hidden={value !== index} sx={{ maxWidth: '100%' }}>
      {value === index && <Grid>{children}</Grid>}
    </Grid>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

class Search extends Component {
  state = {
    showTour: true,
    isTourOpen: false,
    activeTab: 0
  };

  closeTour = () => {
    this.setState({ isTourOpen: false });
  };

  openTour = () => {
    this.setState({ isTourOpen: true });
  };

  handleChange = (e, newTab) => {
    this.setState({ activeTab: newTab });
  };

  render() {
    const {
      classes,
      postSearchResults,
      userSearchResults,
      collectionSearchResults
    } = this.props;
    const { activeTab } = this.state;
    const { posts, searchText, isLoading } = postSearchResults;
    const { users } = userSearchResults;
    const { collections } = collectionSearchResults;

    // TODO: Nextjs
    const showTabs = windowExists() ? window.innerWidth <= 960 : false;

    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <PageBody pageClass={classes.page}>
            <Fade in timeout={1000}>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={4}
                className={classes.resultsContainer}
              >
                <Grid item xs={12}>
                  <Typography variant="body1">
                    Results for "{searchText}"
                  </Typography>
                </Grid>

                {!isLoading &&
                  posts.length === 0 &&
                  users.length === 0 &&
                  collections.length === 0 && (
                    <Grid item xs={12} style={{ height: '100%' }}>
                      <Typography
                        variant="h5"
                        className={classes.headerText}
                        style={{ textAlign: 'center' }}
                      >
                        Try searching for posts, users, or keywords
                      </Typography>
                    </Grid>
                  )}

                {showTabs &&
                  (posts.length > 0 ||
                    users.length > 0 ||
                    collections.length > 0) && (
                    <>
                      <Grid item xs={12}>
                        <Tabs
                          value={activeTab}
                          onChange={this.handleChange}
                          TabIndicatorProps={{
                            style: { backgroundColor: '#fff' }
                          }}
                        >
                          <Tab label="Posts" />
                          <Tab label="People" />
                          <Tab label="Collections" />
                        </Tabs>
                      </Grid>

                      <TabPanel value={activeTab} index={0}>
                        <Grid item xs={12} className={classes.feedContainer}>
                          <Feed
                            isLoading={isLoading}
                            hasMore
                            classes={classes}
                            posts={posts}
                            hideInteractions
                          />
                        </Grid>
                      </TabPanel>

                      <TabPanel value={activeTab} index={1}>
                        <Grid item xs={12}>
                          <People classes={classes} people={users} />
                        </Grid>
                      </TabPanel>

                      <TabPanel value={activeTab} index={2}>
                        <Grid item xs={12}>
                          {collections.map((rec) => {
                            return (
                              <RecommendedCollections
                                classes={classes}
                                collection={rec}
                              />
                            );
                          })}
                        </Grid>
                      </TabPanel>
                    </>
                  )}

                {!showTabs &&
                  (posts.length > 0 ||
                    users.length > 0 ||
                    collections.length > 0) && (
                    <>
                      <Grid
                        item
                        lg={!isLoading && users.length === 0 ? 12 : 7}
                        md={!isLoading && users.length === 0 ? 12 : 8}
                        xs={12}
                        className="Tour-SearchPosts"
                        style={{
                          display:
                            !isLoading && posts.length === 0 ? 'none' : ''
                        }}
                      >
                        <Typography variant="h5" className={classes.headerText}>
                          Posts
                        </Typography>
                        <Feed
                          isLoading={isLoading}
                          hasMore
                          classes={classes}
                          posts={posts}
                          hideInteractions
                        />
                      </Grid>
                      <Grid
                        container
                        direction="column"
                        item
                        lg={!isLoading && posts.length === 0 ? 12 : 5}
                        md={!isLoading && posts.length === 0 ? 12 : 4}
                        xs={12}
                        className="Tour-SearchUsers"
                        style={{
                          display: users.length === 0 ? 'none' : 'inherit'
                        }}
                      >
                        <Grid item xs={12}>
                          <Typography
                            variant="h5"
                            className={classes.headerText}
                          >
                            People
                          </Typography>
                          <People classes={classes} people={users} />
                        </Grid>
                        <Grid
                          item
                          direction="column"
                          xs={12}
                          style={{
                            display:
                              collections.length === 0 ? 'none' : 'inherit'
                          }}
                        >
                          <Typography
                            variant="h5"
                            className={classes.headerText}
                          >
                            Collections
                          </Typography>
                          {collections.map((rec) => {
                            return (
                              <RecommendedCollections
                                classes={classes}
                                collection={rec}
                              />
                            );
                          })}
                        </Grid>
                      </Grid>
                    </>
                  )}
              </Grid>
            </Fade>
          </PageBody>
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userSearchResults: state.searchResults.userSearchResults, // userSearchResultsSelector(state),
    postSearchResults: state.searchResults.postSearchResults, // postSearchResultsSelector(state)
    collectionSearchResults: state.searchResults.collectionSearchResults // postSearchResultsSelector(state)
  };
};

Search.propTypes = {
  classes: PropTypes.object.isRequired,
  userSearchResults: PropTypes.object.isRequired,
  postSearchResults: PropTypes.object.isRequired,
  collectionSearchResults: PropTypes.object.isRequired
};

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
};

export default connect(mapStateToProps)(withStyles(styles)(Search));
