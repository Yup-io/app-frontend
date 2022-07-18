/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { levelColors } from '../../utils/colors';
import Fade from '@mui/material/Fade';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { trimURL, getFavicon } from '../../utils/url';
import axios from 'axios';
import { apiBaseUrl, defaultPostImageUrl } from '../../config';
import { TruncateText } from '../styles';
import YupImage from '../YupImage';

const styles = (theme) => ({
  container: {
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    height: '8rem',
    [theme.breakpoints.down('sm')]: {
      height: '9rem'
    },
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    '&:visited': {
      textDecoration: 'none',
      color: '#fff'
    }
  },
  linkImg: {
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    backgroundColor: '#4f4f4f',
    alignItems: 'center',
    borderRadius: '200px',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%',
      maxWidth: '6rem'
    },
    [theme.breakpoints.down('sm')]: {
      width: '4.5rem',
      height: '4.5rem'
    }
  },
  previewContainer: {
    textDecoration: 'none',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    fontSize: '1rem',
    fontWeight: 500,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9,
    width: '400px',
    [theme.breakpoints.down('sm')]: {
      width: '60vw'
    }
  },
  description: {
    position: 'relative',
    fontSize: '0.7rem',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    fontWeight: 200,
    maxWidth: '400px',
    [theme.breakpoints.down('sm')]: {
      width: '60vw'
    }
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: '100',
    overflowWrap: 'break-word',
    display: 'none',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: 0,
    [theme.breakpoints.down('sm')]: {
      width: '30vw'
    }
  },
  previewData: {
    position: 'relative',
    textAlign: 'left',
    zIndex: 5,
    background: '',
    padding: '4% 6%'
  },
  favicon: {
    height: 30,
    width: 30,
    marginRight: '0rem',
    border: 'none',
    borderRadius: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      height: 18,
      width: 18
    }
  }
});

class FallbackImage extends Component {
  state = { imgLink: '' };
  componentDidMount() {
    (async () => {
      const imgL = await this.resetImgLink();
      this.setState({ imgLink: imgL });
    })();
  }

  async resetImgLink() {
    const { url } = this.props;
    const res = await axios.post(`${apiBaseUrl}/posts/linkpreview/`, {
      url
    });
    return res.data.previewData.img;
  }

  render() {
    const { classes, imageStyle } = this.props;
    return (
      <img
        className={classes.linkImg}
        style={imageStyle}
        src={this.state.imgLink || defaultPostImageUrl}
        alt="fallback"
      />
    );
  }
}

FallbackImage.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  imageStyle: PropTypes.object.isRequired
};

const StyledFallbackImage = withStyles(styles)(FallbackImage);

class ObjectPreview extends Component {
  async resetImgLink() {
    const { url } = this.props;
    const res = await axios.post(`${apiBaseUrl}/posts/linkpreview/`, {
      url
    });
    return res.data.previewData.img;
  }

  render() {
    const {
      image,
      title,
      description,
      url,
      classes,
      quantiles,
      rankCategory
    } = this.props;
    let faviconURL = null;
    if (url != null) {
      faviconURL = getFavicon(url);
    }
    // TODO: Adjust this for Yup lists, should only get quantile for category and website being compared
    const overallQuantile = rankCategory
      ? quantiles[rankCategory]
      : quantiles.overall;
    const levelColor = overallQuantile ? levelColors[overallQuantile] : null;

    const imageStyle = {
      border: levelColor ? `3px solid ${levelColor}` : 'none'
    };

    return (
      <ErrorBoundary>
        <Fade in timeout={2000}>
          <div className={classes.container} href={url} target="_blank">
            <a
              className={classes.link}
              href={url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div
                className={classes.previewContainer}
                href={url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className={classes.previewData}>
                  <Grid
                    alignItems="flex-start"
                    container
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={1} sm={2}>
                      <YupImage
                        alt={title}
                        className={classes.linkImg}
                        src={[image]}
                        unloader={
                          <StyledFallbackImage
                            className={classes.linkImg}
                            url={url}
                            imageStyle={imageStyle}
                          />
                        }
                        target="_blank"
                        style={imageStyle}
                      />
                    </Grid>
                    <Grid item xs={6} sm={8} style={{ margin: 'auto 0px' }}>
                      <TruncateText variant="h5">
                        {title && title.split('|', 1)}
                      </TruncateText>
                      <TruncateText variant="body2" lines={3} sx={{ pt: 1 }}>
                        {description || url}
                      </TruncateText>
                    </Grid>
                    <Grid item xs={1}>
                      <YupImage
                        align="right"
                        href={url}
                        src={faviconURL}
                        className={classes.favicon}
                        target="_blank"
                      />
                    </Grid>
                  </Grid>
                  <p className={classes.url}>{url && trimURL(url)}</p>
                </div>
              </div>
            </a>
          </div>
        </Fade>
      </ErrorBoundary>
    );
  }
}

ObjectPreview.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  quantiles: PropTypes.object.isRequired,
  rankCategory: PropTypes.string
};

export default withStyles(styles)(ObjectPreview);
