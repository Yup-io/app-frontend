import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import AddComment from './AddComment'
import Portal from '@mui/material/Portal'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Comment from './Comment'
import BottomCommentPanel from './BottomCommentPanel'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import withStyles from '@mui/styles/withStyles'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import isEqual from 'lodash/isEqual'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  addComment: {
    padding: '12px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '16px',
    color: `${theme.palette.common.first}dd`
  },
  firstComment: {
    margin: '0px 0px 0px -15px'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: `${theme.palette.common.first}dd`,
    fontWeight: 'light'
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  panel: {
    color: '#fedeee'
  }
})

class Comments extends Component {
  state = {
    snackbarOpen: false,
    snackbarContent: '',
    expanded: false
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  handleSnackbarOpen = (msg) => {
    this.setState({ snackbarOpen: true, snackbarContent: msg })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarContent: '' })
  }

  handleExpansionPanelOpen = () => {
    this.setState({ expanded: true })
  }

  handleExpansionPanelClick = (event) => {
    this.setState({ expanded: !this.state.expanded })
  }

  render () {
    const { classes, comments, postid, account } = this.props

    const Snack = (props) => (
      <Portal>
        <Snackbar
          className={classes.snackUpper}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.snackbarOpen}
          onClose={this.handleSnackbarClose}
          autoHideDuration={4000}
        >
          <SnackbarContent
            className={classes.snack}
            message={this.state.snackbarContent}
          />
        </Snackbar>
      </Portal>
    )

    if (comments == null || comments.length === 0) {
      return (
        <Fragment>
          <AddComment postid={postid}
            handleSnackbarOpen={this.handleSnackbarOpen}
            handleExpansionPanelOpen={this.handleExpansionPanelOpen}
            commentsCount={0}
          />
          <Snack />
        </Fragment>
      )
    }

    const firstComment = comments[0]
    const restOfComments = comments.slice(1)
    return (
      <ErrorBoundary>
        <Fragment>
          <div style={{ marginLeft: '0px' }}>
            <Accordion
              expanded={this.state.expanded}
              onChange={this.state.onChange}
              onClick={restOfComments.length > 0 ? this.handleExpansionPanelClick : () => {}}
              style={{
                boxShadow: 'none',
                paddingLeft: '0px',
                paddingBottom: '0px',
                marginBottom: '0px',
                backgroundColor: 'transparent',
                fill: 'white'
              }}
            >
              <AccordionSummary
                style={{ margin: '0px 0px -20px -12px' }}
                expandIcon={restOfComments.length > 0 ? <ExpandMoreIcon style={{ fill: 'white' }} /> : <div />}
                className={classes.panel}
              >
                <Comment
                  style={{ margin: '-20px 0px 0px -12px' }}
                  comment={firstComment}
                  account={account}
                  handleSnackbarOpen={this.handleSnackbarOpen}
                />
              </AccordionSummary>
              <AccordionDetails
                style={{ padding: '0px 12px 12px' }}
              >
                <BottomCommentPanel
                  comments={restOfComments}
                  account={account}
                  handleSnackbarOpen={this.handleSnackbarOpen}
                />
              </AccordionDetails>
            </Accordion>
          </div>
          <AddComment postid={postid}
            handleSnackbarOpen={this.handleSnackbarOpen}
            handleExpansionPanelOpen={this.handleExpansionPanelOpen}
            commentsCount={this.props.comments.length}
          />
          <Snack />
        </Fragment>
      </ErrorBoundary>
    )
  }
}

const getCommentsInfo = (state, postid) => {
  return state.postComments && state.postComments[postid]
}

const getComments = (commentsInfo) => {
  return commentsInfo && commentsInfo.comments
}

const commentsSelector = createSelector(getCommentsInfo, getComments)

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)

  return {
    account,
    comments: commentsSelector(state, ownProps.postid)
  }
}

Comments.propTypes = {

  classes: PropTypes.object.isRequired,
  comments: PropTypes.array,
  account: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Comments))
