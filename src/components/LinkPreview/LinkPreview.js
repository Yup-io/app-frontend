import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { trimURL, getFavicon } from '../../utils/url';
import { defaultPostImageUrl } from '../../config';
import { TruncateText } from '../styles';
import YupImage from '../YupImage';

const styles = (theme) => ({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
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
    minHeight: '12rem',
    maxHeight: '15rem',
    [theme.breakpoints.down('sm')]: {
    minHeight: '15rem',
    maxHeight: '18rem',
    },
    objectFit: 'cover',
    backgroundColor: theme.palette.M500,
    objectPosition: '50% 50%',
    alignItems: 'center',
    borderRadius: '0.5rem 0.5rem 0px 0px',
    position: 'relative',
    [theme.breakpoints.up('1700')]: {
      maxHeight: '25rem',
      width: '100%'
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
    opacity: 0.9
  },
  description: {
    position: 'relative',
    textShadow: `0px 0px 5px ${theme.palette.M900}88`,
    margin: '0.5rem 0',
    fontWeight: 300
  },
  url: {
    position: 'relative',
    fontSize: '10px',
    fontWeight: 100,
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    width: '70%',
    marginTop: 0,
    opacity: '0.5'
  },
  previewData: {
    textAlign: 'left',
    borderRadius: theme.spacing(1.5),
    zIndex: 5,
    background: theme.palette.M800_OP5,
    padding: '2% 3% 2% 3%',
    width: '100%',
    backdropFilter: 'blur(40px)',
    boxShadow: `0px 0px 10px ${theme.palette.M850}AA`
  },
  previewDataContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2)
  }
});

class LinkPreview extends Component {
  constructor(props) {
    super(props);
    this.state = { imgRetryCount: 0 };
  }

  addDefaultSrc = (e) => {
    e.target.onerror = null;
    e.target.src = defaultPostImageUrl;
    this.setState({ imgRetryCount: this.state.imgRetryCount + 1 });
  };

  render() {
    const { image, title, description, url, classes } = this.props;
    let faviconURL = null;

    if (url != null) {
      faviconURL = getFavicon(url);
    }

    return (
      <ErrorBoundary>
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
              <img
                alt={title}
                className={classes.linkImg}
                src={image || defaultPostImageUrl}
                target="_blank"
                onError={this.state.imgRetryCount === 0 && this.addDefaultSrc}
              />
              <div className={classes.previewDataContainer}>
              <div className={classes.previewData}>
                <Grid alignItems="center" container direction="row" spacing={2}>
                  <Grid item xs={2} sm={1}>
                    <YupImage
                      align="right"
                      href={url}
                      src={faviconURL}
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        border: 'none',
                        borderRadius: theme.spacing(1.5)
                      }}
                      target="_blank"
                    />
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <Typography variant="h6" className={classes.title}>
                      <TruncateText lines={2}>{title}</TruncateText>
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant='b2' className={classes.description}>
                  <TruncateText lines={5}>
                    {description || url}
                  </TruncateText>
                </Typography>
                <Typography className={classes.url}>{url && trimURL(url)}</Typography>
                </div>
              </div>
            </div>
          </a>
        </div>
      </ErrorBoundary>
    );
  }
}

LinkPreview.propTypes = {
  image: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinkPreview);
