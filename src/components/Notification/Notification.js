import React, { Component, useState } from 'react';
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
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

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

const Notification = ({notif, classes}) => {
  const { isLoggedIn, ...account } = useAuth();
  const [invokerWeight, setInvokerWeight] = useState()
  const [underlineColor, setUnderlineColor] = useState()

  useEffect(()=>{
    if(notif.invoker) getInvokerWeight()
  }, [])

  const getInvokerWeight = async () => {
    const invoker = notif.invoker
    const res = await axios.get(
      `${apiBaseUrl}/levels/user/${invoker.eosname || invoker}`
    );
    if (!res.error) {
      getUnderlineColor(res.data.quantile, res.data.weight);
    }
  }

  const getUnderlineColor =(quantile, weight) =>{
    const underlineColor = levelColors[quantile];
    setInvokerWeight(weight)
    setUnderlineColor(underlineColor)
  }

  const getInvoker = () => {
    if (notif.invoker === notif.recipient) {
      return 'You';
    }
    return notif.invoker.username || notif.invoker;
  }

  const getPostUrl =()=> {
    
    if (notif.post) {
      // backend dosen't return the post url yet will delete later
      const { url, caption } = notif.post;
      return isURL(url ?? caption)
        ? (url ?? caption)
        : `/p/${notif.post._id.postid}`;
    } else if (notif.action === 'follow') {
      return notif.invoker.eosname
        ? `/${notif.invoker.eosname}`
        : `/${notif.invoker}`;
    }
    else if (notif.action === 'update') {
      if(notif.type === 'ethaddressmissing'){
        return `/account/${account.name}?dialogOpen=true`
      }
    }

    return null;
  }

  const isURL =(url)=> {
   try {
      return !!new URL(url);
   } catch (_) {
      return false;
   }
  }


    const postUrl = getPostUrl();
    const invoker = getInvoker();
    const formattedTime = moment(new Date(notif.createdAt)).fromNow(true);
    const target = isURL(notif.post && (notif.post?.url ?? notif.post.caption))
      ? '_blank'
      : '_self';

    const defaultImage =
      'https://source.unsplash.com/featured/?black,white,abstract';
    if (!notif) {
      return null;
    }
   if(notif.action==='update') console.log(notif)
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


Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  notif: PropTypes.object.isRequired
};

export default withStyles(styles)(Notification);
