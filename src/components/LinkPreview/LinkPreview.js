import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
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
    height: '13rem',
    [theme.breakpoints.down('sm')]: {
      height: '18rem'
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
    minHeight: '15rem',
    maxHeight: '15rem',
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
    color: theme.palette.M100,
    '&:visited': {
      textDecoration: 'none',
      color: theme.palette.M100
    },
    maxHeight: '500px'
  },
  title: {
    position: 'relative',
    fontSize: '1.2rem',
    fontWeight: 600,
    textShadow: `0px 0px 5px ${theme.palette.M900}aa`,
    color: theme.palette.M100,
    opacity: 0.9
  },
  description: {
    position: 'relative',
    fontSize: '0.8rem',
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
    position: 'absolute',
    bottom: 0,
    textAlign: 'left',
    zIndex: 5,
    background: `linear-gradient(${theme.palette.M850}00, ${theme.palette.M850}46, ${theme.palette.M850}ae, ${theme.palette.M850}dd, ${theme.palette.M850}ed, ${theme.palette.M850}fe, ${theme.palette.M850}, ${theme.palette.M850})`,
    padding: '2% 3% 0 3%',
    width: '100%',
    backdropFilter: 'blur(2px)',
    boxShadow: `0px 2px ${theme.palette.M850}`
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
    const { image, title, description, url, classes, caption } = this.props;
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
                        borderRadius: '0.5rem'
                      }}
                      target="_blank"
                    />
                  </Grid>
                  <Grid item xs={10} sm={11}>
                    <div className={classes.title}>
                      <TruncateText lines={2}>{title}</TruncateText>
                    </div>
                  </Grid>
                </Grid>
                <div className={classes.description}>
                  <TruncateText lines={5}>
                    {description || caption}
                  </TruncateText>
                </div>
                <p className={classes.url}>{url && trimURL(url)}</p>
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
  caption: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinkPreview);
