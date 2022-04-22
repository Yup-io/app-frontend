import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ListPostGrid from '../YupLeaderboard/ListPostGrid'
import withStyles from '@mui/styles/withStyles';
import Fade from '@mui/material/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import Grid from '@mui/material/Grid'
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'
import { accountInfoSelector } from '../../redux/selectors'

const styles = theme => ({
  container: {
    width: '100%',
    backgroundSize: 'cover',
    fontFamily: '"Gilroy", sans-serif',
    background: 'transparent',
    boxShadow: '0px 1px 0px #AAAAAA09',
    padding: '5px 0px',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '0%',
      marginRight: '0%'
    },
    [theme.breakpoints.down('md')]: {
      padding: '0.5% 0%'
    },
    [theme.breakpoints.down('sm')]: {
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
    [theme.breakpoints.down('lg')]: {
      maxWidth: '80%',
      flexBasis: '80%'
    }
  },
  voteComp: {
    [theme.breakpoints.down(undefined)]: {
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
              justifyContent='flex-start'
              alignItems='center'
            >
              <Grid item
                sm={7}
                className={classes.listPreview}
              >
                <Component {...this.props} />
              </Grid>
              <Grid item
                sm={5}
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
    );
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
