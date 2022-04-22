import React, { Component } from 'react'
import PostDisplay from '../../components/Post/PostDisplay'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid'
import '../../components/Twitter/twitter.css'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import path from 'path'
import axios from 'axios'
import { CreateCollectionFab } from '../../components/Miscellaneous'
import { PageBody } from '../pageLayouts'

const { BACKEND_API } = process.env

const styles = () => ({
  gridContainer: {
    height: '100vh'
  }
})

class PostPage extends Component {
  state = {
    post: null,
    isLoading: true
  }

  componentDidMount () {
    this.loadPostData()
    if (!window.analytics) {
      window.analytics.page('Post Page')
    }
  }

  loadPostData = () => {
    (async () => {
      try {
        const { location } = this.props
        const postId = path.basename(location.pathname)
        const post = (await axios.get(`${BACKEND_API}/posts/post/${postId}`)).data
        this.setState({ post, isLoading: false })
      } catch (err) {
        this.setState({ isLoading: false })
      }
    })()
  }

  render () {
    const { classes } = this.props
    const { post, isLoading } = this.state

    return (
      <ErrorBoundary>
        <PageBody>
          <Grid container
            justifyContent='center'
            alignItems='center'
            className={classes.gridContainer}
          >
            <PostDisplay isLoading={isLoading}
              post={post}
            />
          </Grid>
          <CreateCollectionFab />
        </PageBody>
      </ErrorBoundary>
    );
  }
}

PostPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withStyles(styles)(PostPage)
