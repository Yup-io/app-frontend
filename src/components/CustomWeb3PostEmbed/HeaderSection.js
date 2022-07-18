import React from 'react';
import { Link, Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';

const HeaderSection = ({ classes, name, username, creator, tweetType, tweetLink, hideBird }) => {
  let web3PostIcon;

  if (tweetType === 'retweet') {
    web3PostIcon = classes.retweetweb3PostIcon;
  } else if (tweetType === 'reply') {
    web3PostIcon = classes.web3PostIcon;
  } else {
    if (hideBird === true) {
      web3PostIcon = classes.retweetweb3PostIcon;
    } else {
      web3PostIcon = classes.web3PostIcon;
    }
  }

  const accountLink = `farcaster://profiles/${creator}/posts`;
  const isMobile = window.innerWidth <= 600;

  return (
    <Grid
      container
      direction="row"
      className={classes.header}
      justifyContent="space-between"
      alignItems="start"
      spacing={0}
    >
      <Grid item>
        <Grid
          container
          direction="row"
          spacing={1}
          className={classes.userTags}
        >
          <Grid item>
            <Link href={accountLink} target="_blank" underline="none">
              <Typography variant="body1" style={{ maxWidth: '300px' }}>
                {name.substring(0, 80)}
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href={accountLink} target="_blank" underline="none">
              <Typography variant="body2" className={classes.userHandle}>
                @{username}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={web3PostIcon}>
        <Link href={tweetLink} target="_blank" underline="none">
          <img
            /* the src image should change depending on if farcaster or lens */
            src="/images/icons/farcaster.svg"
            height={isMobile ? '12' : '16'}
            alt="🖼️"
          />
        </Link>
      </Grid>
    </Grid>
  );
};
HeaderSection.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  tweetType: PropTypes.string.isRequired,
  tweetLink: PropTypes.string.isRequired,
  hideBird: PropTypes.bool.isRequired
};

export default HeaderSection;
