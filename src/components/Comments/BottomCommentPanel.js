import PropTypes from 'prop-types'
import React, { memo } from 'react'
import Comment from './Comment'
import Grid from '@material-ui/core/Grid'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { v4 as uuidv4 } from 'uuid'

function BottomCommentPanel (props) {
  const { comments, levels, account, handleSnackbarOpen } = props
  const commentsToRender = comments.map((com) => (
    <Grid item
      container
      direction='column'
      justify='flex-start'
      key={(com._id && com._id.commentid) || uuidv4()}
      style={{ paddingLeft: '0px', marginLeft: '0px' }}
    >
      <Comment
        style={{ marginTop: '-20px', marginBottom: '-20px', paddingLeft: '0px' }}
        comment={com}
        levels={levels}
        account={account}
        handleSnackbarOpen={handleSnackbarOpen}
      />
    </Grid >
  )
  )

  return (
    <ErrorBoundary>
      <Grid>
        { commentsToRender}
      </Grid>
    </ErrorBoundary>
  )
}

BottomCommentPanel.propTypes = {
  account: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  levels: PropTypes.object.isRequired,
  handleSnackbarOpen: PropTypes.func.isRequired
}

export default memo(BottomCommentPanel)
