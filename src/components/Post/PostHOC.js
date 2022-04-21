import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Comments from '../Comments/Comments'
import PostGrid from '../PostGrid/PostGrid'
import withStyles from '@mui/styles/withStyles'
import { connect } from 'react-redux'
import { fetchPostComments } from '../../redux/actions'
import PostHeader from '../PostHeader/PostHeader'
import { Divider, Fade, Typography } from '@mui/material'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  article: {
    borderRadius: '0.5rem',
    boxShadow:
      `0px 0px 30px 0px ${theme.palette.shadow.first}44, 0px 0px 0.75px  ${theme.palette.shadow.first}66`,
    backgroundSize: 'cover',
    marginLeft: '0%',
    marginRight: '0%',
    marginBottom: '1rem',
    minWidth: '0px',
    [theme.breakpoints.down('lg')]: {
      margin: 'auto',
      maxWidth: '640px'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100vw',
      boxShadow: 'none'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '640px',
      maxHeight: '1500px'
    }
  },
  user: {
    display: 'flex',
    padding: '0% 0% 0% 0%'
  },
  avatar: {
    maxWidth: '50px',
    maxHeight: '50px',
    paddingRight: '3%'
  },
  avatarImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%'
  },
  postCaptionHeader: {
    padding: '0.1vh 1vw',
    width: '100%',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      zoom: '80%'
    }
  },
  postCaption: {
    padding: '16px 16px',
    wordBreak: 'break-word',
    width: '100%'
  },
  divider: {
    [theme.breakpoints.up('580')]: {
      display: 'none'
    }
  }
})

class PostHOC extends PureComponent {
  componentDidMount () {
    this.loadPostData()
  }

  loadPostData () {
    (async () => {
      await this.fetchComments()
    })()
  }

  fetchComments = async () => {
    const { dispatch, postid } = this.props
    await dispatch(fetchPostComments(postid))
  }

  render () {
    const {
      classes,
      account,
      author,
      caption,
      votes,
      postid,
      weights,
      quantiles,
      postType,
      hideInteractions,
      rating,
      component: Component
    } = this.props
    return (
      <ErrorBoundary>
        <Fade in
          timeout={2000}
        >
          <div
            style={{ background: 'transparent', paddingTop: '0.25rem' }}
          >
            <PostHeader
              postid={postid}
              postType={postType}
              hideInteractions={hideInteractions}
              author={author}
            />
            <div className={classes.article}>
              <Component {...this.props} />
              <Typography className={classes.postCaptionHeader}
                variant='h6'
              >
                <PostGrid
                  account={account}
                  postid={postid}
                  caption={caption}
                  quantiles={quantiles}
                  votes={votes}
                  weights={weights}
                  postType={postType}
                  rating={rating}
                />
                <Comments postid={postid} />
              </Typography>
              <Divider
                className={classes.divider}
                style={{ backgroundColor: '#ffffff05' }}
                variant='fullWidth'
              />
            </div>
          </div>
        </Fade>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)
  return {
    account
  }
}

PostHOC.propTypes = {
  author: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  votes: PropTypes.number.isRequired,
  weights: PropTypes.object.isRequired,
  quantiles: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  account: PropTypes.object,
  hideInteractions: PropTypes.bool,
  component: PropTypes.element.isRequired,
  previewData: PropTypes.object,
  postType: PropTypes.string,
  rating: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(PostHOC))
