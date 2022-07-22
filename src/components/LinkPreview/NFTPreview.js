import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import { Grid, Tooltip, Typography } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import axios from 'axios';
import { CldImg, CldVid } from '../../components/Miscellaneous';
import { trimURL, getFavicon } from '../../utils/url';
import { raribleApiUrl } from '../../config';
import { TruncateText } from '../styles';
import YupImage from '../YupImage';

// TODO: Simplify regex, put in utils file

const ZORA_TAGS = ['zora.co'];
const zoraSearch = `.*(${ZORA_TAGS.join(').*|.*(')}).*`;
const zoraQuery = new RegExp(zoraSearch, 'i');

const SUPERRARE_TAGS = ['superrare.co/artwork-v2', 'superrare.com/artwork-v2'];
const superrareSearch = `.*(${SUPERRARE_TAGS.join(').*|.*(')}).*`;
const superrareQuery = new RegExp(superrareSearch, 'i');

const RARIBLE_TAGS = ['app.rarible.com/token', 'rarible.com/token'];
const raribleSearch = `.*(${RARIBLE_TAGS.join(').*|.*(')}).*`;
const raribleQuery = new RegExp(raribleSearch, 'i');

const knownOriginSearch =
  '^((http:|https:)([/][/]))?(www.)?knownorigin.io/gallery/[^/]*[/]?$';
const knownOriginQuery = new RegExp(knownOriginSearch, 'i');

const foundationSearch =
  '^((http:|https:)([/][/]))?(www.)?foundation.app/(.+)/(.+)[^/]$';
const foundationQuery = new RegExp(foundationSearch, 'i');

const styles = (theme) => ({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    [theme.breakpoints.down('md')]: {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    }
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
    minHeight: '15rem',
    maxHeight: '30rem',
    objectFit: 'cover',
    backgroundColor: theme.palette.M500,
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%'
    },
    [theme.breakpoints.down('sm')]: {
      borderRadius: 0
    }
  },
  previewContainer: {
    textDecoration: 'none',
    padding: '8px',
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9,
    [theme.breakpoints.down('lg')]: {
      width: 'auto'
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem'
    }
  },
  description: {
    position: 'relative',
    fontSize: '12px',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    fontWeight: 300,
    lineHeight: 1.3,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  },
  credits: {
    position: 'relative',
    fontSize: '14px',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px'
    }
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: '100',
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: 0,
    display: 'none'
  },
  previewData: {
    textAlign: 'left',
    borderRadius: theme.spacing(1.5),
    zIndex: 5,
    background: `${theme.palette.M800}AA`,
    padding: '2% 3% 2% 3%',
    width: '100%',
    backdropFilter: 'blur(40px)',
  },
  previewDataContainer: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    padding: theme.spacing(2)
  }
});

class NFTPreview extends Component {
  state = {
    creator: '',
    owners: []
  };

  async getCreatorAndOwners() {
    await this.getCreator();
    await this.getOwners();
  }

  async getCreator() {
    const { url, previewData } = this.props;
    const raribleNFT = url && url.match(raribleQuery);
    const superrareNFT =
    url && url.match(superrareQuery);
    const foundationNFT =
    url && url.match(foundationQuery);
    const zoraNFT = url && url.match(zoraQuery);
    const knownOriginNFT =
    url && url.match(knownOriginQuery);

    if (raribleNFT && previewData[0] && previewData[0].item) {
      const res = await axios.get(
        `${raribleApiUrl}/${previewData[0].item.creator}`
      );
      this.setState({
        creator: res.data.username
      });
    } else if (superrareNFT && previewData.createdBy) {
      this.setState({
        creator: previewData.createdBy
      });
    } else if (
      (foundationNFT || zoraNFT || knownOriginNFT) &&
      previewData.creator
    ) {
      this.setState({
        creator: previewData.creator
      });
    }
  }

  async getOwners() {
    const { previewData, url } = this.props;
    const raribleNFT = url && url.match(raribleQuery);
    const foundationNFT =
      url && url.match(foundationQuery);
    const zoraNFT = url && url.match(zoraQuery);

    if (raribleNFT && previewData[0] && previewData[0].item) {
      previewData[0].item.owners.forEach(async (owner) => {
        const res = await axios.get(`${raribleApiUrl}/${owner}`);
        if (res.data.username && res.data.username !== this.state.creator) {
          this.setState({
            owners: [...this.state.owners, res.data.username]
          });
        }
      });
    } else if ((foundationNFT || zoraNFT) && previewData.owner) {
      if (previewData.owner !== this.state.creator) {
        this.setState({
          owners: [...this.state.owners, previewData.owner]
        });
      }
    }
  }

  componentDidMount() {
    if (!this.props.previewData) {
      return;
    }
    this.getCreatorAndOwners();
  }

  render() {
    const {
      image,
      title,
      description,
      url,
      classes,
      mimeType,
      postid
    } = this.props;
    let faviconURL = null;

    if (url != null) {
      faviconURL = getFavicon(url);
    }
    const fileType =
      image && image.substring(image.lastIndexOf('.') + 1, image.length);
    const isVideo =
      fileType === 'mp4' || (mimeType && mimeType.includes('video'));
    const isGif = fileType === 'gif';

    return (
      <ErrorBoundary>
        <div className={classes.container} href={url} target="_blank">
          <a
            className={classes.link}
            href={url || window.location.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div
              className={classes.previewContainer}
              href={url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div style={{borderRadius: '12px', overflow: 'hidden'}}>
                {isVideo ? (
                  <CldVid
                    className={classes.linkImg}
                    style={{ overFlow: 'hidden', maxHeight: '1000px' }}
                    src={image}
                    postid={postid}
                    alt={description}
                    height="auto"
                    width="100%"
                    playing
                    muted
                    loop
                    playsinline
                  />
                ) : isGif ? (
                  <img
                    src={image}
                    alt={description}
                    className={classes.linkImg}
                  />
                ) : (
                  <CldImg
                    className={classes.linkImg}
                    postid={postid}
                    src={image}
                    alt={image}
                  />
                )}
              </div>

              <div className={classes.previewDataContainer}>
                <div className={classes.previewData}>
                  <Grid
                    container
                    direction="column"
                    spacing={1}
                    justifyContent="center"
                  >
                    <Grid item>
                      <Grid alignItems="center" container direction="row">
                        <Grid item>
                          <YupImage
                            align="right"
                            href={url}
                            src={faviconURL}
                            style={{
                              height: 30,
                              width: 30,
                              marginRight: '0.5rem',
                              border: 'none'
                            }}
                            target="_blank"
                            alt={faviconURL}
                          />
                        </Grid>
                        <Grid item>
                          <TruncateText
                            variant="subtitle2"
                            className={classes.title}
                            lines={2}
                          >
                            {title}
                          </TruncateText>
                        </Grid>
                      </Grid>
                    </Grid>
                    {(this.state.creator || this.state.owners.length > 0) && (
                      <Grid item>
                        <Grid
                          justifyContent="left"
                          container
                          direction="row"
                          alignItems="center"
                          spacing={0}
                          style={{ height: '30px' }}
                        >
                          {this.state.creator && (
                            <Grid item xs={this.state.owners.length > 0 ? 4 : 6}>
                              <Tooltip
                                title="Creator"
                                placement="top"
                                arrow
                                disableTouchListener
                              >
                                <TruncateText variant="body2">
                                  {`🧑‍🎨` + `\u00A0` + ` ${this.state.creator}`}
                                </TruncateText>
                              </Tooltip>
                            </Grid>
                          )}
                          {this.state.owners.length > 0 && (
                            <Grid item xs={this.state.creator ? 8 : 6}>
                              <Tooltip
                                title="Owner"
                                placement="top"
                                arrow
                                disableTouchListener
                              >
                                <TruncateText variant="body2">
                                  {`🗝` +
                                    `\u00A0\u00A0` +
                                    `${this.state.owners.join(', ')}`}
                                </TruncateText>
                              </Tooltip>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    )}
                    <Grid item>
                      <TruncateText variant="body2" lines={2}>
                        {description || url}
                      </TruncateText>
                      <Typography className={classes.url}>
                        {url && trimURL(url)}
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </a>
        </div>
      </ErrorBoundary>
    );
  }
}

NFTPreview.propTypes = {
  previewData: PropTypes.object,
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NFTPreview);
