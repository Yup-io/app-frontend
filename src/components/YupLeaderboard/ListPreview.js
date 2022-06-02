import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ReactPlayer from 'react-player/lazy';
import { ConditionalLinkWrapper, ResponsiveEllipsis } from '../Miscellaneous';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import React, { useEffect, useState } from 'react';
import {
  getDefaultImage,
  isCollectionUrl,
  isNftUrl
} from '../../utils/helpers';
import useStyles from './ListPreviewStyles';
import useDevice from '../../hooks/useDevice';
import axios from 'axios';
import { apiBaseUrl, audisEmbedUrl } from '../../config';
import { getFavicon } from '../../utils/url';

const defaultImageUrl = getDefaultImage();

const ListPreview = ({ previewData, url, image, title, caption, rank }) => {
  const classes = useStyles();
  const { isMobile } = useDevice();

  const [faviconUrl, setFaviconUrl] = useState(null);
  const [collectionImg, setCollectionImg] = useState(null);
  const [postBroken, setPostBroken] = useState(false);

  const isAudiusPost = previewData?.trackId && previewData?.ownerId;
  const isNftArt = isNftUrl(url);
  const isCollection = isCollectionUrl(url);

  const addCollectionImg = async () => {
    const collection = url.split('/');
    const name = collection[4];
    const id = collection[5];

    const res = (await axios.get(`${apiBaseUrl}/collections/${name}/${id}`))
      .data;
    const collectionImage = res?.posts?.[0]?.previewData?.img;
    const collectionImgFallback = res.posts?.[1]?.previewData?.img; // ??? Not sure what it means

    setCollectionImg(collectionImage || collectionImgFallback);
  };

  const addDefaultVideo = (e) => {
    e.target.onerror = null;
    setPostBroken(true);
  };

  const addDefaultSrc = (e) => {
    e.target.onerror = null;
    e.target.src = faviconUrl || defaultImageUrl;
    e.target.style = {
      border: 'none !important',
      maxWidth: '50px',
      maxHeight: '50px'
    };
  };

  useEffect(() => {
    if (isCollection && !collectionImg) {
      addCollectionImg();
    }
  }, [isCollection, collectionImg]);

  useEffect(() => {
    if (previewData?.url) {
      setFaviconUrl(getFavicon(previewData.url));
    }
  }, [previewData]);

  const AudiusComp = () => (
    <div className={classes.audiusPost}>
      <iframe
        src={`${audisEmbedUrl}?id=${previewData?.trackId}&ownerId=${previewData?.ownerId}&flavor=compact`}
        allow="encrypted-media"
        width="100%"
        height="120"
        style={{ border: 'none' }}
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <Fade in timeout={1000}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className={classes.container}
          spacing={isMobile ? 2 : 3}
        >
          <Grid item xs={1}>
            <Typography variant="h5" className={classes.rank}>
              {rank}
            </Typography>
          </Grid>
          {isAudiusPost && (
            <Grid item sm={11}>
              <AudiusComp />
            </Grid>
          )}
          {previewData && previewData.url && !isAudiusPost && (
            <>
              <Grid item xs={2}>
                {image && image.includes('nft.mp4') ? (
                  <ReactPlayer
                    className={classes.nftArt}
                    target="_blank"
                    url={image}
                    playing
                    muted
                    loop
                    playsinline
                    light={postBroken ? faviconUrl || defaultImageUrl : ''}
                    onError={addDefaultVideo}
                  />
                ) : (
                  <img
                    src={
                      isCollection
                        ? collectionImg || defaultImageUrl
                        : image || faviconUrl || defaultImageUrl
                    }
                    className={
                      isNftArt || isCollection ? classes.nftArt : classes.image
                    }
                    onError={addDefaultSrc}
                    alt="favicon"
                  />
                )}
              </Grid>
              <Grid item xs={9} sm={9}>
                <ConditionalLinkWrapper
                  href={previewData.url}
                  style={{ textDecoration: 'none' }}
                >
                  <Typography variant="h5" className={classes.caption}>
                    <ResponsiveEllipsis
                      basedOn="letters"
                      ellipsis="..."
                      maxLine="1"
                      text={title || previewData.url}
                      trimRight
                    />
                  </Typography>
                </ConditionalLinkWrapper>
              </Grid>
            </>
          )}
        </Grid>
      </Fade>
    </ErrorBoundary>
  );
};

export default ListPreview;
