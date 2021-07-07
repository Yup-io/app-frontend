import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Comments from '../Comments/Comments'
import PostGrid from '../PostGrid/PostGrid'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { fetchPostComments } from '../../redux/actions'
import PostHeader from '../PostHeader/PostHeader'
import Divider from '@material-ui/core/Divider'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  article: {
    borderRadius: '0.5rem',
    boxShadow:
      '20px 20px 20px 0px rgb(255 255 255 / 2%), -2px -2px 20px rgb(0 0 0 / 3%), inset 12px 3px 20px 0px rgb(255 255 255 / 3%), inset -3px -7px 17px 0px #0404044a, 5px 5px 9px 0px rgb(255 255 255 / 5%), -20px -20px 12px rgb(0 0 0 / 3%), inset 1px 1px 6px 0px rgb(255 255 255 / 2%), inset -1px -1px 2px 0px #0404040f',
    backgroundColor: '#1b1b1ba1',
    backgroundSize: 'cover',
    marginLeft: '0%',
    marginRight: '0%',
    fontFamily: '"Gilroy", sans-serif',
    marginBottom: '1rem',
    minWidth: '0px',
    [theme.breakpoints.down('md')]: {
      margin: 'auto auto 1rem auto',
      maxWidth: '640px'
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100vw',
      boxShadow: 'none',
      padding: 4
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
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '200',
    fontSize: '20px',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    [theme.breakpoints.down('xs')]: {
      zoom: '80%'
    }
  },
  postCaption: {
    fontFamily: '"Gilroy", sans-serif',
    fontSize: '20px',
    fontWeight: '200',
    lineHeight: 'normal',
    padding: '16px 16px',
    wordBreak: 'break-word',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.up('1700')]: {
      fontSize: '34px'
    }
  },
  h: {
    fontSize: '18px',
    fontFamily: '"Gilroy", sans-serif'
  },
  cap1: {
    fontFamily: '"Gilroy", sans-serif',
    fontSize: '28px',
    lineHeight: 'normal',
    [theme.breakpoints.down('sm')]: {
      lineHeight: 'normal'
    },
    [theme.breakpoints.up('1700')]: {
      fontSize: '34'
    }
  },
  head: {
    marginBottom: '-20px'
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
            className={classes.article}
            style={{ background: 'transparent', boxShadow: 'none' }}
          >
            <PostHeader
              postid={postid}
              postType={postType}
              hideInteractions={hideInteractions}
              author={author}
            />
            <div className={classes.article}>
              <Component {...this.props} />
              <div className={classes.postCaptionHeader}
                width='500px'
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
              </div>
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
