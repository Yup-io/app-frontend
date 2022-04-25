import React, { memo } from 'react'
import YupListPostController from './YupListPostController'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = theme => ({
  progress: {
    padding: theme.spacing(4),
    color: 'white'
  },
  container: {
    width: '100%',
    margin: 'auto',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%'
    },
    [theme.breakpoints.down('xs')]: {
      marginBottom: '1%',
      minWidth: '100%'
    },
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
  }
})

function YupListFeed ({
  posts,
  classes,
  postType,
  category,
  isSearch
}) {
  return (
    <ErrorBoundary>
      <div align='center'
        className={classes.container}
      >
        {
          posts.map((post, i) => {
            return (
              <YupListPostController post={post}
                key={post._id.postid}
                postType={postType}
                rank={isSearch ? post.listRank : i + 1}
                rankCategory={category}
              />
            )
          })
        }
      </div>
    </ErrorBoundary>
  )
}

YupListFeed.propTypes = {
  postType: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  isSearch: PropTypes.bool.isRequired
}

export default memo(withStyles(styles)(YupListFeed))
