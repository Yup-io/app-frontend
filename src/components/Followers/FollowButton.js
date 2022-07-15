import React, { Fragment, useState } from 'react';
import { unfollowUser, followUser } from '../../redux/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './styles';
import { parseError } from '../../eos/error';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import axios from 'axios';
import { accountInfoSelector } from '../../redux/selectors';
import { getAuth } from '../../utils/authentication';
import { YupButton } from '../Miscellaneous';
import { apiBaseUrl } from '../../config';

const FollowButton = ({ eosname, isLoggedIn, account, followingInfo, dispatch }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarContent, setSnackbarContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const classes = useStyles();

  const handleSnackbarOpen = (msg) => {
    setSnackbarOpen(true)
    setSnackbarContent(msg)
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
    setSnackbarContent('')
  };

  const handleFollow = async (accountToFollow) => {
    try {
      if (account == null) {
        handleSnackbarOpen('Login to follow user!');
        return;
      }
      setIsLoading(true)

      const auth = await getAuth(account);
      const followData = { account: account.name, accountToFollow, ...auth };

      const followParams = new URLSearchParams(followData).toString();
      await axios.post(`${apiBaseUrl}/v2/followers?${followParams}`);

      await dispatch(followUser(account.name, accountToFollow));
    } catch (err) {
      console.log(parseError(err));
      handleSnackbarOpen(parseError(err, 'follow'));
    }

    setIsLoading(false)
  };

  const handleUnfollow = async (accountToUnfollow) => {
    try {
      if (account == null) {
        handleSnackbarOpen('Login to unfollow user!');
        return;
      }
      setIsLoading(true)

      const auth = await getAuth(account);
      const followData = { account: account.name, accountToUnfollow, ...auth };

      const followParams = new URLSearchParams(followData).toString();
      await axios.delete(`${apiBaseUrl}/v2/followers?${followParams}`);

      await dispatch(unfollowUser(account.name, accountToUnfollow));
    } catch (err) {
      console.log(parseError(err));
      handleSnackbarOpen(parseError(err));
    }

    setIsLoading(false)
  };

  if (isLoggedIn || account == null || followingInfo == null) {
    return null;
  }

  const isFollowing = followingInfo[eosname]
    ? followingInfo[eosname].followers.some((user) => {
        return user._id === account.name;
      })
    : [];

  if (isFollowing) {
    return (
      <ErrorBoundary>
        <Fragment>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={4000}
            className={classes.snackUpper}
            onClose={handleSnackbarClose}
            open={snackbarOpen}
          >
            <SnackbarContent
              className={classes.snack}
              message={snackbarContent}
            />
          </Snackbar>
          {isLoading ? (
            <CircularProgress
              size={16}
              style={{
                color: 'white',
                marginTop: '3px',
                marginRight: '20px'
              }}
            />
          ) : (
            <YupButton
              size="small"
              color="secondary"
              variant="outlined"
              className={classes.followButton}
              onClick={() => {
                handleUnfollow(eosname);
              }}
            >
              Following
            </YupButton>
          )}
        </Fragment>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary>
        <Fragment>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={4000}
            className={classes.snackUpper}
            onClose={handleSnackbarClose}
            open={snackbarOpen}
          >
            <SnackbarContent
              className={classes.snack}
              message={snackbarContent}
            />
          </Snackbar>
          {isLoading ? (
            <CircularProgress
              size={16}
              style={{
                color: 'white',
                marginTop: '3px',
                marginRight: '20px'
              }}
            />
          ) : (
            <YupButton
              size="small"
              color="secondary"
              variant="outlined"
              className={classes.followButton}
              onClick={() => {
                handleFollow(eosname);
              }}
            >
              Follow
            </YupButton>
          )}
        </Fragment>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state);

  return {
    account,
    followingInfo: state.followersByUser
  };
};

FollowButton.propTypes = {
  classes: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  eosname: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  followingInfo: PropTypes.object,
  account: PropTypes.object
};

export default connect(mapStateToProps)(FollowButton);
