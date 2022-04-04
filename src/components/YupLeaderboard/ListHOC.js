import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ListPostGrid from '../YupLeaderboard/ListPostGrid'
import { withStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Grid from '@material-ui/core/Grid'
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  container: {
    width: '100%',
    borderRadius: 0,
    border: '0px solid #ffffff',
    backgroundSize: 'cover',
    fontFamily: '"Gilroy", sans-serif',
    background: 'transparent',
    boxShadow: '0px 1px 0px #AAAAAA09',
    padding: '5px 0px',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0%',
      marginRight: '0%'
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0.5% 0%'
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100vw',
      padding: '2% 0%'
    }
  },
  divider: {
    [theme.breakpoints.up('580')]: {
      display: 'none'
    }
  },
  listPreview: {
    [theme.breakpoints.down('md')]: {
      maxWidth: '80%',
      flexBasis: '80%'
    }
  },
  voteComp: {
    [theme.breakpoints.down('1500')]: {
      display: 'none'
    }
  }
})

class ListHOC extends PureComponent {
  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }
  render () {
    const { classes, account, votes, postid, weights, quantiles,
      postType, caption, rating, component: Component } = this.props

    return (
      <ErrorBoundary>
        <Fade in
          timeout={1000}
        >
          <div className={classes.container}>
            <Grid
              container
              direction='row'
              justify='flex-start'
              alignItems='center'
            >
              <Grid item
                sm={8}
                className={classes.listPreview}
              >
                <Component {...this.props} />
              </Grid>
              <Grid item
                sm={4}
                className={classes.voteComp}
              >
                <ListPostGrid
                  caption={caption}
                  account={account}
                  postid={postid}
                  quantiles={quantiles}
                  votes={votes}
                  weights={weights}
                  postType={postType}
                  rating={rating}
                  isList='true'
                />
              </Grid>
            </Grid>
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

ListHOC.propTypes = {
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

export default connect(mapStateToProps)(withStyles(styles)(ListHOC))
