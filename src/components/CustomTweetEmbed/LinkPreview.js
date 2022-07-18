import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material/';

const LinkPreview = ({
  description,
  image,
  title,
  url,
  classes,
  size
}) => {
  const getDomain = (str) => {
    let a = document.createElement('a');
    a.href = str;
    return a.hostname;
  };

  return (
    <div
      className={
        size === 'large'
          ? classes.LinkPreviewMainLarge
          : classes.LinkPreviewMain
      }
    >
      <a
        className={classes.LinkPreviewAnchor}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <div className={classes.LinkPreviewImageContainer}>
          <img
            className={
              size === 'large'
                ? classes.LinkPreviewImageLarge
                : classes.LinkPreviewImage
            }
            src={image}
            alt={description}
          />
        </div>
      </a>
      <a
        className={classes.LinkPreviewAnchor}
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={
            size === 'large'
              ? classes.LinkPreviewContentLarge
              : classes.LinkPreviewContent
          }
        >
          <Typography className={classes.LinkPreviewTitle}>{title}</Typography>
          <Typography className={classes.LinkPreviewText}>
            {`${description && description.substring(0, 50)}...` ||
              `${url && url.substring(0, 50)}...`}{' '}
          </Typography>
          <Typography className={classes.LinkPreviewURL}>
            {url && getDomain(url)}
          </Typography>
        </div>
      </a>
    </div>
  );
};

LinkPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  url: PropTypes.string,
  title: PropTypes.string,
  size: PropTypes.string,
  url: PropTypes.string
};

export default LinkPreview;
