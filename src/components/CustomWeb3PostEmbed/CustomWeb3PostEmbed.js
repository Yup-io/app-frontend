import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import { Fade } from '@mui/material/';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

// child componenents
import Reply from './Reply';
import Retweet from './Retweet';
import Quoted from './Quoted';
import Original from './Original';

const styles = (theme) => ({
  container: {
    padding: '16px',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left',
    width: '100%'
  },
  twitterTag: {
    textDecoration: 'none !important',
    fontWeight: 500
  },
  replyTextWithBar: {
    textAlign: 'left',
    '&::before': {
      border: '1.2px solid #AAAAAA',
      content: " '' ",
      top: 0,
      left: -35,
      fontSize: 0,
      bottom: 2,
      width: 0,
      zIndex: 1,
      height: '92%'
    }
  },
  tweetText: {
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    wordWrap: 'break-word'
  },
  twitterName: {
    margin: 0
  },
  twitterHandle: {
    color: 'grey'
  },
  userAvatar: {
    width: '2.5rem',
    aspectRatio: 1 / 1,
    borderRadius: '50%'
  },
  tweetImg: {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    overflow: 'hidden',
    borderRadius: '12px'
  },
  retweetContainer: {
    border: `solid 1px ${theme.palette.M500}`,
    borderRadius: '12px',
    overflow: 'hidden',
    padding: '8px'
  },
  videoTweetContainer: {
    boxShadow: '0px 0px 5px #AAAAA0',
    border: `solid 1px ${theme.palette.M300}`
  },
  retweetUserAvatar: {
    width: '1.5rem',
    borderRadius: '50%'
  },
  retweetTwitterName: {
    display: 'inline',
    marginRight: '10px'
  },
  retweetTwitterBirdIcon: {
    display: 'none'
  },
  retweetVid: {
    borderRadius: '12px 0px 0px 12px'
  },
  replyTwitterName: {
    display: 'inline',
    marginRight: '10px'
  },
  barDiv: {
    border: `1.2px solid ${theme.palette.M600}`,
    content: " '' ",
    top: 0,
    left: -35,
    fontSize: 0,
    bottom: 2,
    width: 0,
    zIndex: 1,
    height: '92%',
    margin: 'auto',
    background: '#AAAAAA'
  },
  replyLine: {
    backgroundColor: 'gray',
    width: 2,
    marginRight: 'auto',
    height: 100
  },
  mainReplyContainer: {
    padding: '16px',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    textAlign: 'left',
    width: '100%'
  },
  replyContainer: {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyOriginalContainer: {
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    textAlign: 'left'
  },
  replyImageContainer: {
    color: 'white !important',
    textAlign: 'left'
  },
  LinkPreviewImageSmall: {
    height: '100%',
    borderRadius: '12px 0px 0px 12px'
  },
  LinkPreviewContentSmall: {
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  LinkPreviewMain: {
    maxHeight: 150,
    minHeight: 150,
    overflow: 'hidden',
    marginBottom: 25,
    boxShadow: `0px 0px 3px #AAAAA0`,
    borderRadius: 20
  },
  LinkPreviewURL: {
    color: 'gray'
  },
  LinkPreviewImageLarge: {
    width: '100%',
    borderRadius: '12px 12px 0px 0px'
  },
  LinkPreviewImageSmallContainer: {
    height: '100%'
  },
  LinkPreviewImage: {
    maxWidth: 550
  },
  LinkPreviewContentLarge: {
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  LinkPreviewMainLarge: {
    overflow: 'hidden',
    marginBottom: 25,
    flexDirection: 'column',
    boxShadow: `0px 0px 3px #AAAAA0`,
    borderRadius: 12
  },
  LinkPreviewAnchor: {
    color: 'inherit',
    textDecoration: 'none'
  },
  letterAvatar: {
    border: '2px solid rgb(218, 218, 218)',
    borderRadius: '100%',
    backgroundColor: 'rgba(9, 9, 9, 0.44)',
    fontFamily: 'Gilroy',
    fontWeight: '600',
    color: 'rgb(218, 218, 218)'
  }
});

class CustomWeb3PostEmbed extends Component {
  render() {
    const { previewData, classes } = this.props;
    // if (!previewData || !previewData.tweetInfo) {
    //   return <div />;
    // }
    // const retweet = previewData.tweetInfo.retweeted_status
    //   ? !isEmpty(previewData.tweetInfo.retweeted_status)
    //   : false;
    // const quoted = previewData.tweetInfo.quoted_status
    //   ? !isEmpty(previewData.tweetInfo.quoted_status)
    //   : false;
    // const reply = previewData.tweetInfo.in_reply_to_status_id
    //   ? !isEmpty(previewData.tweetInfo.reply_status)
    //   : false;


    return (
      <Fade in timeout={1000}>
        <div>
          {/*retweet ? (
            <Retweet previewData={previewData} classes={classes} />
          ) : quoted ? (
            <Quoted previewData={previewData} classes={classes} />
          ) : reply ? (
            <Reply previewData={previewData} classes={classes} />
          ) : (
          )*/}
          <Original previewData={previewData} classes={classes} />
        </div>
      </Fade>
    );
  }
}

CustomWeb3PostEmbed.propTypes = {
  previewData: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomWeb3PostEmbed);
