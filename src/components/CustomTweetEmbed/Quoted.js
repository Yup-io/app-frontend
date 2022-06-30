import React from 'react';
import { Link, Typography, Grid } from '@mui/material';
import TweetVidPlayer from './TweetVidPlayer';
import PropTypes from 'prop-types';
import { parseText, linkMentions } from './Util/Util';
import HeaderSection from './HeaderSection';
import Avatar from './Avatar';

const Quoted = ({ tweetData, classes }) => {
  const { user, quoted_status: quotedStatus } = tweetData.tweetInfo;
  const { user: quotedUser } = quotedStatus;
  const extendedEntities = tweetData.tweetInfo.extended_entities
    ? tweetData.tweetInfo.extended_entities
    : false;
  const quoteExtendedEentities = tweetData.tweetInfo.quoted_status
    .extended_entities
    ? tweetData.tweetInfo.quoted_status.extended_entities
    : false;

  // CHECK EXISTENCE OF ORIGINAL POST VARIABLES AND ASSIGN VALUES
  let originalMediaRootID;
  let quotedMediaRootID;
  let differentMedia;
  let originalHasMedia;

  if (extendedEntities) {
    originalMediaRootID =
      extendedEntities.media && extendedEntities.media[0].id;
    quotedMediaRootID =
      quoteExtendedEentities && quoteExtendedEentities.media[0].id;
    differentMedia = originalMediaRootID !== quotedMediaRootID;
    originalHasMedia = extendedEntities.media
      ? extendedEntities.media.length > 0
      : false;
  }

  let originalMediaURL;
  let originalMediaType;
  let originalHasPhoto;
  let originalHasVideo;

  if (originalHasMedia) {
    originalMediaURL = extendedEntities.media[0].media_url_https
      ? extendedEntities.media[0].media_url_https
      : false;
    originalMediaType = extendedEntities.media[0].type;
    originalHasPhoto = Boolean(originalMediaType === 'photo');
    originalHasVideo = Boolean(
      originalMediaType === 'video' || originalMediaType === 'animated_gif'
    );

    if (originalHasVideo) {
      originalMediaURL = extendedEntities.media[0].video_info.variants[0].url;
    }
  }

  let initialText;
  if (tweetData.tweetInfo.text) {
    initialText = tweetData.tweetInfo.text;
  } else if (tweetData.tweetInfo.full_text) {
    initialText = tweetData.tweetInfo.full_text;
  } else {
    initialText = '';
  }

  let text = parseText(initialText);
  let tweetText = text.split(' ').map((string) => linkMentions(string));

  // CHECK EXISTENCE OF QUOTED POST VARIABLES AND ASSIGN VALUES
  let quotedHasMedia;

  if (quoteExtendedEentities) {
    quotedHasMedia = quoteExtendedEentities.media
      ? quoteExtendedEentities.media.length > 0
      : false;
  }

  let quotedLink;
  let quotedMediaURL;
  let quotedMediaType;
  let quotedHasPhoto;
  let quotedHasVideo;
  let tweetLink;
  if (tweetData.caption) {
    tweetLink = tweetData.caption;
  }

  if (tweetData.tweetInfo.quoted_status_permalink.expanded) {
    quotedLink = tweetData.tweetInfo.quoted_status_permalink.expanded;
  } else {
    quotedLink = '';
  }

  if (quotedHasMedia) {
    quotedMediaURL = quoteExtendedEentities.media[0].media_url_https
      ? quoteExtendedEentities.media[0].media_url_https
      : false;
    quotedMediaType = quoteExtendedEentities.media[0].type;
    quotedHasPhoto = Boolean(quotedMediaType === 'photo');
    quotedHasVideo = Boolean(
      quotedMediaType === 'video' || quotedMediaType === 'animated_gif'
    );

    if (quotedHasVideo) {
      quotedMediaURL =
        quoteExtendedEentities.media[0].video_info.variants[0].url;
    }
  }

  let quotedInitialText;
  if (tweetData.tweetInfo.quoted_status.text) {
    quotedInitialText = tweetData.tweetInfo.quoted_status.text;
  } else if (tweetData.tweetInfo.quoted_status.full_text) {
    quotedInitialText = tweetData.tweetInfo.quoted_status.full_text;
  } else {
    quotedInitialText = '';
  }

  let quotedText = parseText(quotedInitialText);
  let quotedTweetText = quotedText
    .split(' ')
    .map((string) => linkMentions(string));

  return (
    <Grid container="container" className={classes.container}>
      <Grid item xs={12}>
        <Grid container="container" direction="row" spacing={1}>
          <Grid item>
            <Avatar classes={classes} user={user} tweetLink={tweetLink} />
          </Grid>
          <Grid item xs>
            <Grid container="container" direction="column" spacing={1}>
              <Grid item>
                <HeaderSection
                  classes={classes}
                  user={user}
                  tweetLink={tweetLink}
                />
              </Grid>
              <Grid item>
                <Grid container="container" spacing={1}>
                  <Grid item xs={12}>
                    <Link href={tweetLink} target="_blank" underline="none">
                      <Typography variant="body2">{tweetText}</Typography>
                    </Link>
                  </Grid>
                  {originalHasPhoto && originalMediaURL && differentMedia ? (
                    <Grid item xs={12}>
                      <Typography className={classes.tweetText}>
                        <img
                          className={classes.tweetImg}
                          src={
                            tweetData.excludeTweet
                              ? 'https://api.faviconkit.com/twitter.com/128'
                              : originalMediaURL
                          }
                          alt="tweet-image"
                        />
                      </Typography>
                    </Grid>
                  ) : (
                    originalHasVideo &&
                    originalMediaURL && (
                      <Grid item xs={12}>
                        <TweetVidPlayer url={originalMediaURL} />
                      </Grid>
                    )
                  )}
                  {/* RETWEET */}
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="column"
                      className={classes.retweetContainer}
                    >
                      <Grid item>
                        <Grid container direction="column">
                          <Grid item xs={12} style={{ padding: 8 }}>
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Grid item>
                                <Avatar
                                  classes={classes}
                                  className={classes.retweetUserAvatar}
                                  user={quotedUser}
                                  tweetLink={tweetLink}
                                  tweetType={'retweet'}
                                />
                              </Grid>
                              <Grid item xs>
                                <HeaderSection
                                  classes={classes}
                                  user={quotedUser}
                                  tweetType={'retweet'}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            style={{ padding: '0px 8px 8px 8px' }}
                          >
                            <Link
                              href={quotedLink}
                              target="_blank"
                              underline="none"
                            >
                              <Typography variant="body2">
                                {quotedTweetText}
                              </Typography>
                            </Link>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item style={{ marginBottom: '-2px' }}>
                        {quotedHasPhoto && quotedMediaURL ? (
                          <img
                            className={classes.tweetImg}
                            style={{
                              borderRadius: '0px 0px 12px 12px'
                            }}
                            src={
                              tweetData.excludeTweet
                                ? 'https://api.faviconkit.com/twitter.com/128'
                                : quotedMediaURL
                            }
                            alt="tweet-image"
                          />
                        ) : (
                          quotedHasVideo &&
                          quotedMediaURL && (
                            <TweetVidPlayer url={quotedMediaURL} />
                          )
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
Quoted.propTypes = {
  classes: PropTypes.object.isRequired,
  tweetData: PropTypes.object.isRequired
};
export default Quoted;
