import React from 'react'
import { Link, Typography, Grid } from '@mui/material/'
import PropTypes from 'prop-types'

const HeaderSection = ({ classes, user, tweetType, tweetLink, hideBird }) => {
  let twitterBirdIcon

  if (tweetType === 'retweet') {
    twitterBirdIcon = classes.retweetTwitterBirdIcon
  } else if (tweetType === 'reply') {
    twitterBirdIcon = classes.twitterBirdIcon
  } else {
    if (hideBird === true) {
      twitterBirdIcon = classes.retweetTwitterBirdIcon
    } else {
      twitterBirdIcon = classes.twitterBirdIcon
    }
  }

  const accountLink = `https://twitter.com/${user.screen_name}`
  const isMobile = window.innerWidth <= 600

  return (
    <Grid
      container
      direction='row'
      className={classes.header}
      justifyContent='space-between'
      alignItems='flex-end'
    >
      <Grid item>
        <Grid
          container
          direction='row'
          spacing={1}
          className={classes.userTags}
        >
          <Grid item>
            <Link href={accountLink}
              target='_blank'
              underline='none'
            >
              <Typography variant='body1'
                style={{ maxWidth: '300px' }}
              >
                {user && user.name && user.name.substring(0, 80)}
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href={accountLink}
              target='_blank'
              underline='none'
            >
              <Typography variant='body2'
                className={classes.twitterHandle}
              >
                @{user.screen_name}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item
        className={twitterBirdIcon}
      >
        <Link href={tweetLink}
          target='_blank'
          underline='none'
        >
          <img
            src='/images/icons/twitter.svg'
            height={isMobile ? '12' : '24'}
            alt='twitter'
          />
        </Link>
      </Grid>
    </Grid>
  );
}
HeaderSection.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  tweetType: PropTypes.string.isRequired,
  tweetLink: PropTypes.string.isRequired,
  hideBird: PropTypes.bool.isRequired
}

export default HeaderSection
