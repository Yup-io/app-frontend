import PropTypes from 'prop-types'
import React, { Component, memo } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { levelColors } from '../../utils/colors'
import withStyles from '@mui/styles/withStyles'
import { parseError } from '../../eos/error'
import scatter from '../../eos/scatter/scatter.wallet'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { fetchSocialLevel } from '../../redux/actions'
import { connect } from 'react-redux'

const styles = theme => ({
  panelText: {
    fontFamily: '"Gilroy", sans-serif',
    color: `${theme.palette.common.third}`
  },
  menuItem: {
    fontSize: '20px',
    fontFamily: '"Gilroy", sans-serif',
    color: 'black'
  },
  comment: {
    fontWeight: '500',
    textDecoration: 'none',
    color: `${theme.palette.common.third}`
  }
})

class Comment extends Component {
  state = {
    // anchorEl: false,
    status: null
  }

  /*
  handleCommentMenuClick = event => {
   this.setState({ anchorEl: event.currentTarget })
 }

  handleCommentMenuClose = () => {
    this.setState({ anchorEl: null })
  }
  */

  handleDeleteComment = async () => {
    const { comment, account } = this.props
    try {
      if (account == null) {
        this.props.handleSnackbarOpen('Log in to modify comments!')
        return
      } else {
        const { commentid } = comment._id
        await scatter.scatter.deletecomment({ data: { commentid } })
        this.setState({ status: 'deleted' })
      }
    } catch (err) {
      this.props.handleSnackbarOpen(parseError(err))
    }
    this.handleCommentMenuClose()
  }

  render () {
    const { levels, classes, dispatch, comment } = this.props
    const { status } = this.state

    let authorLevelColor
    const level = levels[comment.author]
    if (!level) {
      dispatch(fetchSocialLevel(comment.author))
      return <div />
    }
    if (levels[comment.author].isLoading) {
      return <div />
    }
    if (level) {
      const { quantile } = level.levelInfo
      authorLevelColor = levelColors[quantile]
    }

    const username = level && level.levelInfo.username
    const eosname = comment.author

    if (username == null || status === 'deleted') { return null }

    /*
    const MenuController = (props) => (

      account && account.name === comment.author && comment._id != null
      ? <Fragment>
        <MoreVertIcon
          onClick={this.handleCommentMenuClick}
          style={{ color: 'white', height: '16px', marginTop: '0px' }}
        />
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleCommentMenuClose}
        >
          <MenuItem
            onClick={this.handleDeleteComment}
            className={classes.menuItem}
          >
          Delete!
          </MenuItem>
        </Menu>
      </Fragment>
      : null
    ) */

    const MenuController = (props) => null

    return (
      <ErrorBoundary>
        <Grid
          container
          direction='row'
          alignItems='flex-start'
        >
          <Grid item>
            <Typography align='left'
              variant='body2'
              className={classes.panelText}
            >
              <a
                className={classes.comment}
                href={`/${username || eosname}`}
                style={{
                  textDecoration: 'underline',
                  marginRight: '4px',
                  textDecorationColor: authorLevelColor,
                  textDecorationStyle: 'solid'
                }}
              >
                {username || eosname}
              </a>
              {comment.comment}
            </Typography>
          </Grid>
          <Grid item
            container
            justifyContent='flex-end'
          >
            <MenuController />
          </Grid >
        </Grid>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    }
  }
}
Comment.propTypes = {
  levels: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  handleSnackbarOpen: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(memo(Comment)))
