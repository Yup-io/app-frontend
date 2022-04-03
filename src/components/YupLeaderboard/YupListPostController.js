import React, { Component } from 'react'
import ListPost from '../Post/ListPost'
import ListHOC from './ListHOC'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPostInfo } from '../../redux/actions'
import isEqual from 'lodash/isEqual'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

class PostController extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  render () {
    const { dispatch, post, rank, rankCategory, categories, postType: listType } = this.props
    dispatch(setPostInfo(post._id.postid, post))

    return (
      <ErrorBoundary>
        <ListPost
          previewData={post.previewData}
          caption={post.caption}
          comment={post.comment}
          image={post.imgHash}
          key={post._id.postid}
          author={post.author}
          postid={post._id.postid}
          quantiles={post.quantiles}
          video={post.videoHash}
          votes={post.upvotes - post.downvotes}
          weights={post.weights}
          postHOC={ListHOC}
          categories={categories}
          rating={post.rating}
          rank={rank}
          listType={listType}
          rankCategory={rankCategory}
        />
      </ErrorBoundary>
    )
  }
}

PostController.propTypes = {
  dispatch: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  rank: PropTypes.string.isRequired,
  postType: PropTypes.string,
  rankCategory: PropTypes.string.isRequired,
  categories: PropTypes.array
}

const mapStateToProps = () => { return {} }
export default connect(mapStateToProps)(PostController)
