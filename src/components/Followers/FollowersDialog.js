import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from './styles';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import FollowButton from './FollowButton';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import { levelColors } from '../../utils/colors';
import UserAvatar from '../UserAvatar/UserAvatar';
import numeral from 'numeral';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { fetchSocialLevel } from '../../redux/actions';
import { accountInfoSelector } from '../../redux/selectors';
import { YupButton } from '../Miscellaneous';
import YupDialog from '../Miscellaneous/YupDialog';

const FollowersDialog = ({ account, followersInfo, levels, dispatch }) => {
  const [open, setOpen] = useState(false)
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { isLoading, followers } = followersInfo;
  const formattedFollowers = numeral(followers.length)
    .format('0a')
    .toUpperCase();
  return (
    <ErrorBoundary>
      <Fragment>
        <YupButton disableRipple onClick={handleClickOpen}>
          <Typography align="left" variant="body2">
            <a style={{ fontWeight: 700 }}>{formattedFollowers} </a> followers
          </Typography>
        </YupButton>

        <YupDialog
          headline="Followers"
          buttonPosition="right"
          open={open}
          onClose={handleClose}
          className={classes.dialog}
          maxWidth="xs"
          fullWidth
          aria-labelledby="customized-dialog-title"
        >
          {isLoading ? (
            <div align="center">
              <CircularProgress className={classes.progress} />
            </div>
          ) : (
            <Grid container direction="column">
              {' '}
              {followers.length === 0 ? (
                <Typography variant="subtitle1">No followers</Typography>
              ) : (
                followers.map((follower) => {
                  if (!levels[follower._id]) {
                    dispatch(fetchSocialLevel(follower._id));
                    return <div />;
                  }
                  if (levels[follower._id].isLoading) {
                    return <div />;
                  }
                  const eosname = follower._id;
                  const level = levels[eosname];
                  const username = level && level.levelInfo.username;
                  const quantile = level && level.levelInfo.quantile;
                  let socialLevelColor = levelColors[quantile];

                  return (
                    <Grid item>
                      <div className={classes.user} key={follower._id}>
                        <Grid
                          alignItems="center"
                          container
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Grid
                              alignItems="center"
                              container
                              direction="row"
                              spacing="16"
                            >
                              <Grid item>
                                <UserAvatar
                                  username={username || eosname}
                                  className={classes.avatarImage}
                                  src={follower.avatar}
                                />
                              </Grid>
                              <Grid item>
                                <Link
                                  onClick={handleClose}
                                  style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                  }}
                                  href={`/account/${follower._id}`}
                                >
                                  <Typography
                                    style={{
                                      textDecoration: socialLevelColor
                                        ? 'underline'
                                        : 'none',
                                      textDecorationColor: socialLevelColor,
                                      textDecorationStyle: socialLevelColor
                                        ? 'solid'
                                        : 'none',
                                      marginLeft: '1rem'
                                    }}
                                    variant="caption"
                                  >
                                    {username || eosname}
                                  </Typography>
                                </Link>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>
                            <FollowButton
                              account={account}
                              className={classes.followsButton}
                              eosname={eosname}
                              isLoggedIn={account && account.name === eosname}
                              style={{ fontFamily: 'Gilroy' }}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  );
                })
              )}
            </Grid>
          )}
        </YupDialog>
      </Fragment>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { username } = ownProps;
  const account = accountInfoSelector(state);
  return {
    account,
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    followersInfo: state.followersByUser[username] || {
      isLoading: true,
      followers: [],
      error: false
    }
  };
};

FollowersDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  account: PropTypes.object,
  levels: PropTypes.object,
  classes: PropTypes.object.isRequired,
  followersInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(FollowersDialog);
