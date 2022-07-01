import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import { levelColors } from '../../utils/colors';
import NotifText from './NotifText';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import axios from 'axios';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ReactPlayer from 'react-player/lazy';
import { apiBaseUrl } from '../../config';

const styles = (theme) => ({
  root: {
    padding: 0,
    cursor: 'pointer',
    position: 'sticky',
    alignContent: 'center',
    maxWidth: '350px',
    fontSize: '12px',
    width: '100%',
    opacity: '0.8'
  },
  anchor: {
    textDecoration: 'none'
  },
  time: {
    color: theme.palette.M100,
    opacity: '0.7',
    fontSize: '10px',
    lineHeight: '12px',
    paddingTop: '2px'
  },
  notifImg: {
    display: 'flex',
    margin: 'auto',
    height: '100%',
    maxWidth: '100%',
    borderRadius: '0.25rem',
    objectFit: 'cover',
    [theme.breakpoints.down('sm')]: {
      height: '50px'
    }
  },
  imgWrapper: {
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    overflow: 'hidden'
  },
  container: {
    height: '100%',
    padding: '5px'
  },
  text: {
    height: '100%',
    color: 'white'
  },
  textContainer: {
    height: '100%',
    maxWidth: '70%'
  },
  notifGrad: {
    position: 'absolute',
    background:
      'linear-gradient(90deg, rgba(43, 43, 43, 0) 0%, rgb(43, 43, 43, 0.5) 50%, rgb(43, 43, 43) 100%)',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0
  },
  notifText: {
    inlineSize: '100%',
    overflowWrap: 'break-word'
  }
});

class Notification extends Component {
  state = {
    invokerWeight: 0,
    underlineColor: ''
  };

  componentDidMount() {
    this.setInvokerWeight();
  }

  async setInvokerWeight() {
    const { invoker } = this.props.notif;
    const res = await axios.get(
      `${apiBaseUrl}/levels/user/${invoker.eosname || invoker}`
    );
    if (!res.error) {
      this.setUnderlineColor(res.data.quantile, res.data.weight);
    }
  }

  setUnderlineColor(quantile, weight) {
    const underlineColor = levelColors[quantile];
    this.setState({
      invokerWeight: weight,
      underlineColor
    });
  }

  getInvoker() {
    const notif = this.props.notif;

    if (notif.invoker === notif.recipient) {
      return 'You';
    }
    return notif.invoker.username || notif.invoker;
  }

  getPostUrl() {
    const { notif } = this.props;
    
    if (notif.post) {
      // backend dosen't return the post url yet will delete later
      const { url, caption } = notif.post;
      return this.isURL(url ?? caption)
        ? (url ?? caption)
        : `/p/${notif.post._id.postid}`;
    } else if (notif.action === 'follow') {
      return notif.invoker.eosname
        ? `/${notif.invoker.eosname}`
        : `/${notif.invoker}`;
    }

    return null;
  }

  isURL(url) {
   try {
      return !!new URL(url);
   } catch (_) {
      return false;
   }
  }

  render() {
    const { classes, notif } = this.props;
    const { underlineColor, invokerWeight } = this.state;

    const postUrl = this.getPostUrl();
    const invoker = this.getInvoker();
    const formattedTime = moment(new Date(this.props.notif.createdAt)).fromNow(true);
    const target = this.isURL(notif.post && (notif.post?.url ?? notif.post.caption))
      ? '_blank'
      : '_self';

    const defaultImage =
      'https://source.unsplash.com/featured/?black,white,abstract';
    if (!notif) {
      return null;
    }

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <a className={classes.anchor} href={postUrl} target={target}>
            <Grid className={classes.container} container spacing={2}>
              <Grid item xs={3} className={classes.imgWrapper}>
                {notif && notif.image && notif.image.includes('nft.mp4') ? (
                  <ReactPlayer
                    className={classes.notifImg}
                    style={{ overflow: 'hidden' }}
                    url={notif.image}
                    height="auto"
                    playing
                    muted
                    loop
                    playsinline
                  />
                ) : (
                  <img
                    className={classes.notifImg}
                    src={notif.image || defaultImage}
                    alt="notification"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                )}
              </Grid>
              <Grid
                className={classes.textContainer}
                container
                item
                direction="column"
                jutifyContent="center"
                xs={9}
              >
                <Grid item className={classes.notifText}>
                  <NotifText
                    invoker={invoker}
                    invokerWeight={invokerWeight}
                    notif={notif}
                    underlineColor={underlineColor}
                  />
                </Grid>
                <Grid item>
                  <div className={classes.time}>{formattedTime}</div>
                </Grid>
              </Grid>
            </Grid>
          </a>
        </div>
      </ErrorBoundary>
    );
  }
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  notif: PropTypes.object.isRequired
};

export default withStyles(styles)(Notification);
