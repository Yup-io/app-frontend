/* eslint-disable */
import React, { Component } from 'react'
import { Grid } from '@mui/material'
import YupListFeed from './YupListFeed'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import axios from 'axios'
import InfiniteScroll from '../InfiniteScroll/InfiniteScroll'
import ListLoader from '../FeedLoader/ListLoader'
import { withRouter } from 'react-router'
import { parseSettings } from '../../utils/yup-list'
import cap from 'lodash/capitalize'
import rollbar from '../../utils/rollbar'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import YupListsMenu from './YupListsMenu'
import Fade from '@mui/material/Fade'
import { createSelector } from 'reselect'
import { updateSearchListPosts } from '../../redux/actions/list-search.actions'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'


const BACKEND_API = process.env.BACKEND_API

const styles = theme => ({
  '@global': {
    '*::-webkit-scrollbar-track': {
      display: 'none'
    },
    '*::-webkit-scrollbar-thumb': {
      display: 'none'
    }
  },
  root: {
    width: '100%',
    margin: 'auto'
  },
  listLoader: {
    backgroundSize: 'cover',
    width: '100%',
    minWidth: '250px',
    maxWidth: '100%',
    height: '100px',
    maxHeight: '100px',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '85vw',
      marginleft: '0'
    }
  },
  scrollDiv: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
   [theme.breakpoints.down('sm')]: {
     maxWidth: '100vw'
   }
  },
  infiniteScroll: {
    width: '100%'
  },
  iconButton: {
    color: '#f2f2f2',
    maxWidth: '5vw',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  hidden: {
    display: 'none'
  }
})

class YupList extends Component {
  state = {
    isMinimize: false,
    isLoading: true,
  }

  componentDidMount () {
    const { subjName, siteName, catName } = this.props
    const isLoading = !siteName && !subjName && !catName
    if (!isLoading) {
      this.fetchYupListPosts(true)
    }
    this.logPageView()
  }

  logPageView = () => {
    const { listTitle } = this.props
    if (listTitle && listTitle.length > 0){
      if (window.analytics) {
        window.analytics.page(listTitle)
       }
    }
  }

  updListData (searchInfo) {
    const { dispatch } = this.props
    dispatch(updateSearchListPosts(searchInfo))
  }

  componentDidUpdate (prevProps) {
    if ((prevProps.siteName !== this.props.siteName ||
      prevProps.catName !== this.props.catName ||
      prevProps.subjName !== this.props.subjName
    )) {
      this.updListData({ start: 0, initialLoad: true, hasMore: true, posts: [], isSearch: false })
      this.fetchYupListPosts(true)
      this.logPageView()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { siteName, subjName, catName, searchInfo } = this.props
    const { posts } = this.props.searchInfo
    const nextPosts = nextProps.searchInfo.posts

    const { isMinimize, isLoading } = this.state
    if (
      siteName !== nextProps.siteName ||
      subjName !== nextProps.subjName ||
      catName !== nextProps.catName ||
      posts.length !== nextPosts.length ||
      isMinimize != nextState.isMinimize ||
      isLoading != nextState.isLoading
    ){
      return true
    }
    return false
  }

  fetchYupListPosts = async (reset) => {
   try {
      const { subjName, siteName, catName } = this.props
      const { start: _start, posts: _posts } = this.props.searchInfo

     // TODO: Find better way to reset start to 0 when changing subjects/categories/sites
     const start = reset ? 0 : _start
     const posts = reset ? [] : _posts

     const listType = `${siteName}:${subjName}`

      const newPosts = (await axios.get(`${BACKEND_API}/v1/lists`, {
        params: {
          start,
          limit: 20,
          category: catName,
          subject: 'posts',
          list: listType,
          order: 1
        }
      })).data

      const filteredPosts = newPosts.filter((post => !!(post.previewData && post.previewData.title)))
      this.updListData({
        hasMore: !!newPosts.length,
        initialLoad: false,
        posts: posts.concat(filteredPosts),
        listType: listType,
        start: start + 20 + 1
      })
      this.setState({
        isLoading: false
      })
    } catch (err) {
        this.updListData({
          hasMore: false,
          initialLoad: false
        })
      rollbar.error(`WEBAPP: Failed to load Yup list error=${err} settings=${JSON.stringify(this.props.settings)}`)
      console.error('Failed to fetch Yup list', err)
    }
  }

  handleScroll = (e) => {
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

  render () {
    const { classes, searchInfo, siteName, subjName, catName } = this.props
    const { posts, initialLoad, hasMore } = searchInfo

    const isLoading = !siteName && !subjName && !catName

    const postType = `${siteName}:${subjName}`
    const hidden = this.state.isMinimize ? classes.hidden : null

    return (
      <ErrorBoundary>
      <Grid container
        alignItems='center'
        direction='column'
        justifycontent='flex-start'
        style={{ width: '100%' }}
      >
        <Grid item
        style={{ width: '100%' }}>
          <div className={classes.root}>
            <YupListsMenu
              isMinimize={this.state.isMinimize}
            />
          </div>
        </Grid>
        { isLoading ?  <div className={classes.feedLoader}>
                   <ListLoader />
                 </div> :
        <Grid item
        style={{ width: '100%' }}>
          <div className={classes.scrollDiv}
          tourname='ListsFeed'>
          {this.state.isLoading ? (
            <div className={classes.listLoader}>
              <ListLoader />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              hasMore={hasMore}
              height='100vh'
              scrollThreshold={0.8}
              onScroll={this.handleScroll}
              next={this.fetchYupListPosts}
              className={classes.infiniteScroll}
              loader={
                <div className={classes.listLoader}>
                  <ListLoader />
                </div>
              }
            >
              <YupListFeed isLoading={initialLoad}
                posts={posts}
                category={catName}
                postType={postType}
                isSearch={this.props.searchInfo.isSearch}
              />
            </InfiniteScroll>
          )}
          </div>
        </Grid>
    }
      </Grid>
      </ErrorBoundary>
    )
  }
}

const getListOpts = (state) => {
  const { router, yupListSettings } = state
  const config = {
    site: router.location.query.site,
    subject: router.location.query.subject,
    category: router.location.query.category
  }
  const { listOptions } = yupListSettings
  return { config, listOptions }
}

const getListSettings = ({ config, listOptions }) => {
  return parseSettings(config, listOptions)
}

const settingsSelector = createSelector(getListOpts, getListSettings)

const mapStateToProps = (state) => {
  const { listOptions } = state.yupListSettings
  const settings = settingsSelector(state)

  const { category, subject, site, preposition } = settings
  const catTitleText = category.altName || cap(category.displayName)
  const subjTitleText = subject.altName || cap(subject.displayName)
  const siteTitleText = preposition ? `${preposition} ${site.altName || cap(site.displayName)}` : ''
  const listTitle = catTitleText.length > 0 && subjTitleText.length > 0 ?
   `${catTitleText} ${subjTitleText} ${siteTitleText}`
   : ''
  return {
    listTitle,
    catName: settings.category && settings.category.name,
    subjName: settings.subject && settings.subject.name,
    siteName: settings.site && settings.site.name,
    searchInfo: state.updateSearchListPosts,
    listOptions
  }
}


YupList.propTypes = {
  classes: PropTypes.object.isRequired,
  catName: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  subjName: PropTypes.string.isRequired,
  listTitle: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
  searchInfo: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(YupList)))
