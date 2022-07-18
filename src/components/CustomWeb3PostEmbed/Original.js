import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, Typography, Grid } from '@mui/material';
import TweetVidPlayer from './TweetVidPlayer';

// util
import { parseText, linkMentions, fetchLinkPreviewData } from './Util/Util';

// components
import LinkPreview from './LinkPreview';
import HeaderSection from './HeaderSection';
import Avatar from './Avatar';

const Original = ({ previewData, classes }) => {
  const { url } = previewData;
  const user = previewData.username;
  // const extendedEntities = previewData.tweetInfo.extended_entities
  //   ? previewData.tweetInfo.extended_entities
  //   : false;
  const extendedEntities = false;

  const [linkPreviewData, setPreviewData] = useState(null);
  // const entities = previewData.tweetInfo.entities
  //   ? previewData.tweetInfo.entities
  //   : false;
  const entities = false;
  const entitiesURLS = entities && entities.urls.length > 0;

  console.log('preview', previewData);

  useEffect(() => {
    if (entitiesURLS) {
      if (entities.urls[0].expanded_url) {
        (async () => {
          try {
            const previewData = await fetchLinkPreviewData(
              entities.urls[0].expanded_url
            );
            setPreviewData(previewData);
          } catch (err) {
            console.error(err);
          }
        })();
      }
    }
  }, []);

  let hasMedia;
  if (extendedEntities) {
    hasMedia = extendedEntities.media
      ? extendedEntities.media.length > 0
      : false;
  }

  let mediaURL;
  let mediaType;
  let hasPhoto;
  let hasVideo;
  let tweetLink = previewData.url ? previewData.url : '';
  if (hasMedia) {
    mediaURL = extendedEntities.media[0].media_url_https
      ? extendedEntities.media[0].media_url_https
      : false;
    mediaType = extendedEntities.media[0].type;
    hasPhoto = Boolean(mediaType === 'photo');
    hasVideo = Boolean(mediaType === 'video' || mediaType === 'animated_gif');

    if (hasVideo) {
      mediaURL = extendedEntities.media[0].video_info.variants[0].url;
    }
  }

  let initialText = previewData.description || previewData.description;
  let text = parseText(initialText);

  let tweetText = text.split(' ').map((string) => linkMentions(string));


  return (
    <Grid container="container" className={classes.container}>
      <Grid item="item" xs={12}>
        <Grid container="container" direction="row" spacing={1}>
          <Grid item="item">
            <Avatar classes={classes} url={previewData.avatar} tweetLink={tweetLink} />
          </Grid>
          <Grid item="item" xs>
            <Grid container="container" direction="column" spacing={0}>
              <Grid item="item">
                <HeaderSection
                  classes={classes}
                  name={previewData.title}
                  creator={previewData.creator}
                  username={previewData.username}
                  tweetLink={tweetLink}
                />
              </Grid>
              <Grid item="item">
                <Grid container="container" spacing={1}>
                  <Grid item="item" xs={12}>
                    <Link href={tweetLink} target="_blank" underline="none">
                      <Typography variant="body2">{tweetText}</Typography>
                    </Link>
                  </Grid>
                  <Grid item="item" xs={12}>
                    {linkPreviewData &&
                      !hasMedia &&
                      !mediaURL &&
                      !previewData.excludeTweet && (
                        <div>
                          <LinkPreview
                            size={'large'}
                            description={linkPreviewData.description || ''}
                            image={linkPreviewData.img}
                            title={linkPreviewData.title}
                            url={url}
                            classes={classes}
                          />
                        </div>
                      )}

                    {hasPhoto && mediaURL ? (
                      <Typography className={classes.tweetText}>
                        <img
                          className={classes.tweetImg}
                          src={
                            previewData.excludeTweet
                              ? 'https://api.faviconkit.com/twitter.com/128'
                              : mediaURL
                          }
                          alt="tweet-image"
                        />
                      </Typography>
                    ) : (
                      hasVideo &&
                      mediaURL && (
                        <TweetVidPlayer
                          className={classes.tweetImg}
                          url={mediaURL}
                        />
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
  );
};
Original.propTypes = {
  previewData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};
export default Original;
