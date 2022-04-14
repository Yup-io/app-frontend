import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import PostGrid from '../PostGrid/PostGrid'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import PostHeader from '../PostHeader/PostHeader'
import { Divider, Fade, Typography } from '@material-ui/core'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  post: {
    background: 'transparent',
    paddingTop: '0.25rem',
    margin: '1rem 0'
  },
  article: {
    border: `1px solid ${theme.palette.M700}`,
    borderRadius: '12px',
    backgroundColor: theme.palette.M850,
    boxShadow:
      `0px 0px 30px 0px ${theme.palette.M900}44, 0px 0px 0.75px  ${theme.palette.M900}66`,
    backgroundSize: 'cover',
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
      margin: 'auto',
      maxWidth: '640px'
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100vw',
      boxShadow: 'none'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '640px',
      maxHeight: '1500px'
    }
  },
  postCaptionHeader: {
    padding: '0.1vh 1vw',
    width: '100%',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    [theme.breakpoints.down('xs')]: {
      zoom: '80%'
    }
  },
  divider: {
    [theme.breakpoints.up('580')]: {
      display: 'none'
    }
  }
})

class PostHOC extends PureComponent {
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
            className={classes.post}
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
