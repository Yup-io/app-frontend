import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import Input from '@mui/material/Input'
import withStyles from '@mui/styles/withStyles'
import { addPostComment } from '../../redux/actions'
import { parseError } from '../../eos/error'
import { connect } from 'react-redux'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import axios from 'axios'
import { accountInfoSelector } from '../../redux/selectors'
import { getAuth } from '../../utils/authentication'
import AuthModal from '../../features/AuthModal'

const { BACKEND_API } = process.env

const styles = theme => ({
  addComment: {
    padding: '12px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '500',
    fontSize: '16px',
    color: '#ffffff'
  },
  panelText1: {
    fontSize: '16px',
    padding: '0px',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '200',
    color: theme.palette.common.first,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  }
})

class AddComment extends PureComponent {
  state = {
    comment: '',
    isLoading: false,
    dialogOpen: false
  }

  handleCommentChange = (event) => {
    this.setState({
      comment: event.target.value
    })
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true })
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false })
  }

  handleInputSelect = () => {
    const { account } = this.props
    if (account == null) {
      this.handleDialogOpen()
    }
  }

  onEnter = async (e) => {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault()
      try {
        const { account, postid, addComment, commentsCount, handleExpansionPanelOpen } = this.props
        if (account == null) {
          this.handleDialogOpen()
          return
        }

        let com = this.state.comment
        if (com.trim() === '') {
          return
        }

        this.setState({ isLoading: true })
        const auth = await getAuth(account)

        const commentData = { eosname: account.name, postid, comment: com, ...auth }

        const commentParams = new URLSearchParams(commentData).toString()
        await axios.post(`${BACKEND_API}/v2/comments?${commentParams}`)

        addComment(account.name, postid, com)
        this.setState({ comment: '' })
        if (commentsCount > 1) { handleExpansionPanelOpen() }
      } catch (err) {
        console.error(err)
        this.props.handleSnackbarOpen(parseError(err, 'createcomment'))
      }
      this.setState({ isLoading: false })
    }
  }

  render () {
    const { classes } = this.props
    const { isLoading } = this.state

    const CommentLoader = () => isLoading
      ? <CircularProgress size={16}
        style={{ color: 'white', marginRight: '-8px' }}
      />
      : null

    const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
    const twitterInfo = cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)

    return (
      <ErrorBoundary>
        <Grid container
          className={classes.addComment}
        >
          <Grid container
            justifyContent='flex-start'
          >
            <Input
              id='demo'
              width='500px'
              placeholder='Add a comment…'
              value={this.state.comment}
              onChange={this.handleCommentChange}
              onKeyDown={this.onEnter}
              onClick={this.handleInputSelect}
              disableUnderline
              className={classes.panelText1}
              fullWidth
              inputProps={{ maxLength: 140 }}
              multiline
              rowsMax={5}
            />
          </Grid>
          <Grid container
            justifyContent='flex-end'
          >
            <CommentLoader />
          </Grid >
          {/* TODO: Use `useAuthModal` after converting to functional component. */}
          {
            twitterInfo
              ? <WelcomeDialog dialogOpen={this.state.dialogOpen}
                handleDialogClose={this.handleDialogClose}
              /> : <AuthModal
                open={this.state.dialogOpen}
                onClose={this.handleDialogClose}
              />
          }

        </Grid>
      </ErrorBoundary>
    )
  }
}

const mapDispatchToProps = {
  addComment: addPostComment
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)

  return {
    account
  }
}

AddComment.propTypes = {
  account: PropTypes.object,
  handleSnackbarOpen: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  commentsCount: PropTypes.number.isRequired,
  handleExpansionPanelOpen: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddComment))
