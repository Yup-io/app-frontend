import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { Card, Chip, Icon, Skeleton } from '@mui/material';
import Typography from '@mui/material/Typography';
import UserAvatar from '../UserAvatar/UserAvatar';
import Grid from '@mui/material/Grid';
import FollowButton from '../Followers/FollowButton';
import EditProfile from '../EditProfile/EditProfile';
import FollowersDialog from '../Followers/FollowersDialog';
import FollowingDialog from '../Followers/FollowingDialog';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { levelColors } from '../../utils/colors';
import numeral from 'numeral';
import { connect } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import CountUp from 'react-countup';
import { fetchSocialLevel } from '../../redux/actions';
import useDevice from '../../hooks/useDevice';
import { TruncateText } from '../styles';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faEthereum } from '@fortawesome/free-brands-svg-icons';
import clsx from 'clsx'

const styles = (theme) => ({
  avatarImage: {
    width: 92,
    height: 92,
    minHeight: 92,
    minWidth: 92,
    fontSize: 60,
    borderRadius: '100%',
    border: `solid 3px ${theme.palette.M300}`,
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      fontSize: 45,
      marginLeft: 0,
      marginBottom: '6vw',
      borderRadius: '100%',
      width: 80,
      height: 80,
      minHeight: 80,
      minWidth: 80
    }
  },
  bio: {
    fontSize: 14,
    padding: 0,
    marginTop: theme.spacing(1),
    fontFamily: 'Gilroy',
    fontWeight: 100,
    display: 'inherit',
    [theme.breakpoints.down('sm')]: {
      fontSize: 12,
      display: 'none'
    }
  },
  card: {
    paddingTop: theme.spacing(-10),
    paddingBottom: theme.spacing(-10),
    boxShadow: `0 0 0 ${theme.palette.M700}81`,
    background: 'transparent',
    backgroundSize: 'cover',
    width: '100%',
    margin: 'auto',
    marginTop: 75,
    maxWidth: '100vw',
    maxHeight: 225,
    position: 'relative',
    [theme.breakpoints.down('xl')]: {
      margin: '75px 0px 0px 0px'
    },
    [theme.breakpoints.down('sm')]: {
      margin: 'auto',
      marginTop: theme.spacing(10),
      height: 175
    }
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24
  },
  content: {
    color: 'black'
  },
  eos: {
    display: 'none'
  },
  hidden: {
    display: 'none'
  },
  largeStat: {
    fontSize: 24,
    padding: 0,
    fontFamily: 'Gilroy',
    fontWeight: '500',
    marginRight: 5,
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
      width: '2rem'
    }
  },
  LinearProgress: {
    height: 3
  },
  linkDecoration: {
    textDecoration: 'none'
  },
  minimize: {
    width: 45,
    height: 45,
    minWidth: 45,
    minHeight: 45,
    fontSize: 18,
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: 35,
      height: 35,
      minWidth: 35,
      minHeight: 35,
      fontSize: 14
    }
  },
  minimizeCard: {
    maxHeight: 53,
    transition: 'max-height 0.2s linear',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 55
    }
  },
  name: {
    lineHeight: '100%'
  },
  profileDetails: {
    paddingBottom: theme.spacing(1),
    boxShadow: 'none',
    maxHeight: '250px',
    height: '140px',
    width: '60%',
    display: 'inline-grid',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '0 4px',
      display: 'block',
      height: '100px',
      width: '100%'
    }
  },
  profileStats: {
    marginLeft: 0,
    padding: '0px 0rem',
    width: '100%',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 2rem 0px calc(2rem - 12px)'
    }
  },
  text2: {
    fontSize: '18px',
    fontWeight: '500',
    fontFamily: 'Gilroy',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  },
  username: {
    fontSize: '18px',
    padding: 0,
    fontFamily: 'Gilroy',
    fontWeight: '100',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  }
});

function formatBio(bio = '') {
  if (!bio) {
    return '';
  }
  if (bio.length > 120) {
    return bio.slice(0, 120) + '...';
  }
  return bio;
}

function ProfileCard(props) {
  const {
    classes,
    balanceInfo,
    account,
    isLoggedIn,
    ratingCount,
    isMinimize,
    levels,
    dispatch,
    accountInfo,
    isLoading
  } = props;
  const { isLightMode } = useThemeMode();
  const { isMobile } = useDevice();
  const YUPBalance = (balanceInfo && balanceInfo.YUP) || 0;
  const YUPBalanceError =
    (balanceInfo && balanceInfo.YUP && balanceInfo.YUP.error) || null;

  const formattedYUPBalance =
    YUPBalance && numeral(Number(YUPBalance)).format('0,0.00');
  const formattedWeight = numeral(
    Math.floor(Number(accountInfo.weight))
  ).format('0,0');
  const formattedRatings = numeral(ratingCount).format('0a').toUpperCase();
  const eosname = accountInfo && (accountInfo.eosname || accountInfo._id);
  const levelInfo = levels[eosname] && levels[eosname].levelInfo;

  const quantile = levelInfo && levelInfo.quantile;
  const socialLevelColor = levelColors[quantile] || 'sixth';

  const displayName =
    (levelInfo && levelInfo.fullname) ||
    (accountInfo &&
      (accountInfo.fullname || accountInfo.username || accountInfo._id));
  const isMirror =
    accountInfo && accountInfo.twitterInfo && accountInfo.twitterInfo.isMirror;
  const isAuthUser =
    accountInfo &&
    accountInfo.twitterInfo &&
    accountInfo.twitterInfo.isAuthUser;
  const defaultUsername =
    accountInfo && (accountInfo.username || accountInfo._id);
  const username = isMirror
    ? accountInfo.twitterInfo.username
    : defaultUsername;

  const hidden = isMinimize ? classes.hidden : null;
  const minimize = isMinimize ? classes.minimize : null;
  const minimizeCard = isMinimize ? classes.minimizeCard : null;

  const avatar = levelInfo && levelInfo.avatar;
  const twitterName =
    accountInfo && accountInfo.twitterInfo && accountInfo.twitterInfo.username;
  const ethAddress = accountInfo?.ethInfo?.address;

  if (!accountInfo.eosname && !isLoading) {
    return <div />;
  }
  if (!levels[accountInfo.eosname] && !isLoading) {
    dispatch(fetchSocialLevel(accountInfo.eosname));
    return <div />;
  }

  const logo = isLightMode
    ? '/images/logos/logo_outline_b.svg'
    : '/images/logos/logo_outline_w.svg';
  return (
    <ErrorBoundary>
      <Card
        className={`${classes.card} ${minimizeCard} Tour-ProfileUsername`}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            width="92px"
            height="92px"
            className={classes.avatarImage}
          />
        ) : (
          <UserAvatar
            alt={accountInfo.username}
            username={accountInfo.username}
            className={`${classes.avatarImage} ${minimize}`}
            src={avatar}
            style={{ border: `solid 3px ${socialLevelColor}` }}
          />
        )}

        <Grid
          container
          alignItems="center"
          direction="row"
          justifyContent="left"
        >
          <Grid
            item
            className={classes.profileDetails}
            style={{
              paddingTop: isMinimize ? '5px' : '',
              marginLeft: isMinimize ? 50 : isMobile ? 0 : 100,
              marginTop: isMobile ? 100 : 0
            }}
          >
            <Grid
              alignItems={isMinimize ? 'flex-start' : 'center'}
              container
              direction="row"
              justifyContent="space-between"
              spacing={0}
            >
              <Grid
                alignItems={isMinimize ? 'flex-start' : 'center'}
                container
                sm={10}
                xs={8}
                direction="row"
                justifyContent="flex-start"
                spacing={0}
              >
                <Grid item>
                  <Typography
                    align="left"
                    className={classes.name}
                    display="inline"
                    variant="capsized_h3"
                  >
                    {isLoading ? (
                      <Skeleton animation={false} />
                    ) : (
                      <TruncateText lines={4} variant="capsized_h3" sx={{ overflow: 'visible' }}>
                        {displayName}
                      </TruncateText>
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item sm={2} xs={3}>
                {isLoading ? (
                  <Skeleton variant="text" />
                ) : (
                  <Grid>
                    {isLoggedIn ? (
                      <EditProfile
                        accountInfo={accountInfo}
                        username={username}
                      />
                    ) : (
                      <FollowButton
                        account={account}
                        eosname={accountInfo.eosname}
                        isLoggedIn={isLoggedIn}
                      />
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Typography
              align="left"
              variant="h5"
              className={`${classes.username} ${hidden}`}
            >
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item>
                    <Typography
                      variant="body2"
                      style={{
                        textDecoration: socialLevelColor ? 'none' : 'none',
                        textDecorationColor: socialLevelColor,
                        textDecorationStyle: socialLevelColor
                          ? 'solid'
                          : 'none',
                        padding: 0
                      }}
                    >
                      {`@${username}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    {isMirror && !isAuthUser ? (
                      <Tooltip
                        enterDelay={200}
                        disableTouchListener
                        title="This account is a mirror of this Twitter user's activity"
                      >
                        <img
                          src="/images/icons/twitter.svg"
                          style={{
                            height: '20px',
                            paddingLeft: '15px',
                            marginTop: '1px'
                          }}
                          alt="twitter"
                        />
                      </Tooltip>
                    ) : null}
                  </Grid>
                  {twitterName && (
                    <Grid item>
                      <a
                        href={`https://twitter.com/${twitterName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.linkDecoration}
                      >
                        <Chip
                          label={twitterName}
                          className={classes.chip}
                          onClick
                          icon={<FontAwesomeIcon icon={faTwitter} />}
                        />
                      </a>
                    </Grid>
                  )}
                  {ethAddress && (
                    <Grid item>
                      {' '}
                      <a
                        href={`https://etherscan.io/address/${ethAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.linkDecoration}
                      >
                        <Chip
                          label={ethAddress.slice(0, 5)}
                          className={classes.chip}
                          onClick
                          icon={<FontAwesomeIcon icon={faEthereum} />}
                        />
                      </a>
                    </Grid>
                  )}
                </Grid>
              )}
            </Typography>
            <Typography
              align="left"
              className={classes.bio}
              color="inherit"
              nowrap
              style={{ wordWrap: 'break-word' }}
              variant="body2"
            >
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                <TruncateText lines={2} className={hidden}>
                  {formatBio(levelInfo && levelInfo.bio) ||
                    (accountInfo && accountInfo.bio)}
                </TruncateText>
              )}
            </Typography>
          </Grid>

          {!isLoading && (
            <>
              <Grid
                alignItems="baseline"
                alignContent="center"
                container
                direction="row"
                spacing={3}
                className={`${classes.profileStats} ${hidden}`}
              >
                <Grid item>
                  <Tooltip
                    placement="bottom"
                    disableTouchListener
                    title={
                      <Typography variant="tooltip">
                        Yup Score: score out of 100 showing how influential you
                        are. The higher the number, the more valuable your
                        rating!
                      </Typography>
                    }
                  >
                    <div className="Tour-Influence">
                      <Typography
                        className={classes.largeStat}
                        style={{
                          display: 'inline-block',
                          color: socialLevelColor
                        }}
                        variant="caption"
                      >
                        <CountUp
                          end={`${formattedWeight}`}
                          duration={2}
                          useEasing={false}
                        />
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{
                          display: 'inline-block',
                          color: socialLevelColor
                        }}
                      >
                        Yup Score
                      </Typography>
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={6} sm={3} md={3}>
                  <Tooltip
                    placement="bottom"
                    disableTouchListener
                    title={
                      <Typography variant="tooltip">
                        {' '}
                        Amount of YUP held by user
                      </Typography>
                    }
                  >
                    {YUPBalanceError ? (
                      ''
                    ) : (
                      <Typography
                        className={clsx(classes.text2, 'Tour-YUPBalance')}
                        style={{
                          display: isMobile ? 'block' : 'inline-block',
                          fontFamily: 'Gilroy'
                        }}
                        variant="caption"
                      >
                        <Grid
                          container
                          direction="row"
                          alignItems="flex-end"
                          spacing={1}
                        >
                          <Grid item>
                            <img
                              src={logo}
                              style={{ width: '15px', height: '15px' }}
                              alt="yup logo"
                            />
                          </Grid>
                          <Grid item>
                            {YUPBalanceError ? 0 : formattedYUPBalance}
                          </Grid>
                        </Grid>
                      </Typography>
                    )}
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid
                alignItems="center"
                container
                direction="row"
                justifyContent="start"
                spacing={3}
                className={`${classes.profileStats} ${hidden}`}
              >
                <Grid item>
                  <Typography align="left" variant="body2">
                    <a style={{ fontWeight: 500 }}>{formattedRatings}</a>{' '}
                    Ratings
                  </Typography>
                </Grid>
                <Grid item>
                  <FollowersDialog
                    account={account}
                    className={classes.text}
                    isLoggedIn={isLoggedIn}
                    username={eosname}
                  />
                </Grid>
                <Grid item>
                  <FollowingDialog
                    account={account}
                    className={classes.text}
                    isLoggedIn={isLoggedIn}
                    username={eosname}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Card>
    </ErrorBoundary>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    }
  };
};

ProfileCard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  ratingCount: PropTypes.number.isRequired,
  balanceInfo: PropTypes.object.isRequired,
  isMinimize: PropTypes.bool.isRequired,
  accountInfo: PropTypes.object.isRequired,
  levels: PropTypes.object,
  account: PropTypes.object,
  isLoading: PropTypes.bool
};

export default connect(mapStateToProps)(withStyles(styles)(ProfileCard));
