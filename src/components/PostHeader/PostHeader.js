import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { connect } from 'react-redux';
import { levelColors } from '../../utils/colors';
import { withRouter } from 'next/router';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import UserAvatar from '../UserAvatar/UserAvatar';
import moment from 'moment';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchSocialLevel } from '../../redux/actions';
import { accountInfoSelector } from '../../redux/selectors';
import { apiBaseUrl, yupCreator } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import YupLink from '../YupLink';

const styles = (theme) => ({
  interactionBar: {
    padding: '1% 1% 0% 0%',
    opacity: '0.7',
    minHeight: '40px',
    height: '40px',
    marginBottom: -5,
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      padding: '0px 3%'
    }
  },
  keyUser: {
    opacity: '80%'
  },
  time: {
    paddingRight: '2px',
    marginLeft: 'auto',
    color: theme.palette.M500,
    fontSize: '14px',
    lineHeight: '14px',
    paddingTop: 0,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  },
  voterOpacity: {
    opacity: '80%'
  },
  avatarImage: {
    fontSize: '14px',
    display: 'grid',
    border: '2px solid',
    borderRadius: '100%',
    width: '22px',
    marginRight: '7px',
    height: '22px'
  }
});

class PostHeader extends Component {
  state = {
    postInteractions: [],
    isLoading: true
  };

  componentDidMount() {
    (async () => {
      try {
        const { postid, hideInteractions, username, account } = this.props;

        let postInteractions = (
          await axios.post(`${apiBaseUrl}/posts/interactions/${postid}`)
        ).data;
        if (hideInteractions && postInteractions.length > 0 && username) {
          postInteractions = postInteractions.filter(
            (curr) => curr.voter === account._id
          );
        }
        this.setState({ postInteractions, isLoading: false });
      } catch (err) {
        this.setState({ isLoading: false });
      }
    })();
  }

  render() {
    const { isLoading, postInteractions } = this.state;
    const { levels, author, classes, hideInteractions, dispatch, router } =
      this.props;
    const { query } = router;

    if (!isLoading && !postInteractions.length) {
      return <div style={{ height: '25px' }} />;
    }

    if (isLoading || !postInteractions.length) {
      return <div className={classes.interactionBar} />;
    }

    const vote = postInteractions[0];
    if (!levels[vote.voter]) {
      dispatch(fetchSocialLevel(vote.voter));
      return <div />;
    }
    if (levels[vote.voter].isLoading || hideInteractions) {
      return <div />;
    }
    const formattedVoteTime = moment(vote.timestamp, 'x').fromNow(true);

    const voterQuantile =
      levels[vote.voter] && levels[vote.voter].levelInfo.quantile;
    const voterLevelColor = voterQuantile
      ? levelColors[voterQuantile]
      : levelColors.sixth;

    const voterAvatar =
      levels[vote.voter] && levels[vote.voter].levelInfo.avatar;
    const voterUsername =
      levels[vote.voter] && levels[vote.voter].levelInfo.username;

    const voterInfo = levels[vote.voter] && levels[vote.voter].levelInfo;
    const voterIsMirror =
      voterInfo && voterInfo.twitterInfo && voterInfo.twitterInfo.isMirror;
    const voterIsAuth =
      voterInfo && voterInfo.twitterInfo && voterInfo.twitterInfo.isAuthUser;

    const authorQuantile = levels[author] && levels[author].levelInfo.quantile;
    const authorAvatar = levels[author] && levels[author].levelInfo.avatar;
    const authorUsername = levels[author] && levels[author].levelInfo.username;
    const authorLevelColor = authorQuantile
      ? levelColors[authorQuantile]
      : levelColors.sixth;
    const voterTwitterUsername =
      voterInfo && voterInfo.twitterInfo ? voterInfo.twitterInfo.username : '';
    const headerDisplayName =
      voterIsMirror &&
      voterInfo.twitterInfo.isTracked &&
      voterInfo.twitterInfo.isMirror
        ? voterTwitterUsername
        : voterUsername || vote.voter;

    console.log('come here', levels, vote.voter, author);

    const VoterHeader = (props) => (
      <Grid container direction="row" alignItems="center">
        <Grid item className={classes.voterOpacity}>
          <UserAvatar
            alt={voterUsername}
            className={classes.avatarImage}
            src={voterAvatar}
            style={{
              borderColor: voterLevelColor
            }}
            username={voterUsername}
          />
        </Grid>
        <Grid className={classes.keyUser} item>
          <YupLink
            style={{ textDecoration: 'none', color: '#fff' }}
            href={`/account/${voterUsername || vote.voter}`}
          >
            <Typography variant="body2" sx={{ mr: 1 }}>
              {headerDisplayName}
            </Typography>
          </YupLink>
        </Grid>
        <Grid item>
          {voterIsMirror && !voterIsAuth ? (
            <img
              src="/images/icons/twitter.svg"
              style={{
                height: '0.5rem',
                paddingLeft: '8px',
                paddingRight: '8px',
                display: 'grid'
              }}
              alt="twitter"
            />
          ) : null}
        </Grid>
      </Grid>
    );

    const AuthorHeader = (props) =>
      author === yupCreator ? null : (
        <Grid container direction="row">
          <Grid item>
            <UserAvatar
              alt={authorUsername}
              className={classes.avatarImage}
              src={authorAvatar}
              style={{
                border: '2px solid',
                borderColor: authorLevelColor,
                borderRadius: '100%',
                width: '22px',
                marginRight: '7px',
                height: '22px'
              }}
            />
          </Grid>
          <Grid item>
            <Typography
              className={classes.username}
              gutterBottom
              inline
              style={{
                fontFamily: '"Gilroy", sans-serif',
                marginRight: '7px'
              }}
            >
              {' '}
              {authorUsername || author}
            </Typography>
          </Grid>
        </Grid>
      );

    return (
      <ErrorBoundary>
        <div
          className={classes.interactionBar}
          style={hideInteractions ? { marginBottom: '-9px' } : {}}
        >
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                {' '}
                {hideInteractions ? null : (
                  <Fragment>
                    <Grid item>
                      <div style={{ marginTop: '2px' }}>
                        <AuthorHeader />
                      </div>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row" alignItems="center">
                        <Grid item className={classes.voterOpacity}>
                          <VoterHeader />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Fragment>
                )}
                <Grid item  className={classes.voterOpacity}>
                  <FontAwesomeIcon className={classes.voterOpacity}
                    icon={vote.like ? faThumbsUp : faThumbsDown}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid className={classes.time}>{formattedVoteTime}</Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state);
  return {
    ...ownProps,
    account,
    username: account && account.name,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    }
  };
};

PostHeader.propTypes = {
  dispatch: PropTypes.func.isRequired,
  levels: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  hideInteractions: PropTypes.bool,
  author: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  username: PropTypes.string,
  account: PropTypes.object
};

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(PostHeader))
);
