/* eslint-disable */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Comments from '../Comments/Comments'
import PostGrid from '../PostGrid/PostGrid'
import withStyles from '@mui/styles/withStyles';
import { connect } from 'react-redux'
import InteractionData from '../InteractionData/InteractionData'
import Divider from '@mui/material/Divider'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import Fade from '@mui/material/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import CustomTweetEmbed  from './CustomTweetEmbed'


const styles = theme => ({
  article: {
    borderRadius: '0.5rem',
    border: '4px solid #eaeaea',
    boxShadow: `20px 20px 30px 0px ${theme.palette.M100}04, -2px -2px 30px  ${theme.palette.M900}06, inset 12px 3px 30px 0px ${theme.palette.M100}04, inset -3px -7px 27px 0px ${theme.palette.M800}4a, 5px 5px 19px 0px ${theme.palette.M100}24, -20px -20px 22px ${theme.palette.M900}06, inset 1px 1px 16px 0px ${theme.palette.M100}05, inset -1px -1px 12px 0px ${theme.palette.M800}0f`,
    backgroundSize: 'cover',
    textAlign: 'center',
    maxWidth: '600px',
    marginLeft: '0%',
    marginRight: '0%',
    fontFamily: '"Gilroy", sans-serif',
    marginBottom: '1rem',
    marginTop: '',
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
      marginLeft: '0%',
      marginRight: '0%'
    },
    [theme.breakpoints.up('1700')]: {
      maxWidth: '900px',
      maxHeight: '1200px'
    }
  },
  user: {
    display: 'flex',
    padding: '1.5% 3% 3% 3%',
    alignItems: 'center',
    maxHeight: '20rem'
  },
  avatar: {
    maxWidth: '50px',
    maxHeight: '50px',
    paddingRight: '3%'
  },
  avatarImage: {
    width: '50px', // default 50px, stretches or compresses horizontally when changed
    height: '50px', // default 50px, stretches or compresses vertically when changed
    borderRadius: '50%' // default 50%
  },
  postCaptionHeader: {
    padding: '0.1vh 1vw',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '200',
    fontSize: '20px', // changes font size of vote counts
    backgroundColor: '#EEE'
  },
  postCaption: {
    fontFamily: '"Gilroy", sans-serif',
    fontSize: '20px', // default 20, changes top url size
    fontWeight: '200',
    lineHeight: 'normal',
    padding: '0px 16px 16px 16px',
    wordBreak: 'break-word',
    background: 'linear-gradient(0deg, #A0A0A0 20%, #1A1A1A 50%)',
    maxHeight: '18rem',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: '24px'
    },
    [theme.breakpoints.up('1700')]: {
      fontSize: '34px'
    }
  },
  h: {
    fontSize: '18px',
    fontFamily: '"Gilroy", sans-serif'
  },
  cap1:
    {
      fontFamily: '"Gilroy", sans-serif',
      fontSize: '28px',
      lineHeight: 'normal',
      [theme.breakpoints.down('sm')]: {
        lineHeight: 'normal'
      },
      [theme.breakpoints.up('1700')]: {
        fontSize: '34'
      }
    },
  head: {
    marginBottom: '-20px'
  },
  interactionData: {
    gutterBottom: 'false',
    margin: '0px -3.5%'
  },
  '.InteractionData.interactionBar.466': {
    margin: '0px -3.5%'
  },
  divider: {
    [theme.breakpoints.up('580')]: {
      display: 'none'
    }
  }
})

const RetweetedTweet = {
created_at: "Wed May 20 14:34:47 +0000 2020",
id: 1263115963685171200,
id_str: "1263115963685171203",
text: "Talked with Ms. @Oprah yesterday about some really amazing things she’s doing to help in the midst of the pandemic.… https://t.co/FIACVkeyLD",
truncated: true,
entities: {
hashtags: [ ],
symbols: [ ],
user_mentions: [
{
screen_name: "Oprah",
name: "Oprah Winfrey",
id: 19397785,
id_str: "19397785",
indices: [
16,
22
]
}
],
urls: [
{
url: "https://t.co/FIACVkeyLD",
expanded_url: "https://twitter.com/i/web/status/1263115963685171203",
display_url: "twitter.com/i/web/status/1…",
indices: [
117,
140
]
}
]
},
in_reply_to_status_id: null,
in_reply_to_status_id_str: null,
in_reply_to_user_id: null,
in_reply_to_user_id_str: null,
in_reply_to_screen_name: null,
user: {
id: 16138216,
id_str: "16138216",
name: "KelleyLCarter",
screen_name: "KelleyLCarter",
location: "Los Angeles, CA",
description: "Emmy award-winning journalist; Sr. Entertainment Reporter for @ESPN's @TheUndefeated. Formerly of @BuzzFeed, @USAToday, @Freep, @ChicagoTribune and @EbonyMag",
url: "https://t.co/UFpD9oO7eo",
entities: {
url: {
urls: [
{
url: "https://t.co/UFpD9oO7eo",
expanded_url: "http://www.espn.go.com",
display_url: "espn.go.com",
indices: [
0,
23
]
}
]
},
description: {
urls: [ ]
}
},
protected: false,
followers_count: 21074,
friends_count: 981,
listed_count: 413,
created_at: "Fri Sep 05 01:13:29 +0000 2008",
favourites_count: 26199,
utc_offset: null,
time_zone: null,
geo_enabled: true,
verified: true,
statuses_count: 106716,
lang: null,
contributors_enabled: false,
is_translator: false,
is_translation_enabled: false,
profile_background_color: "352726",
profile_background_image_url: "http://abs.twimg.com/images/themes/theme5/bg.gif",
profile_background_image_url_https: "https://abs.twimg.com/images/themes/theme5/bg.gif",
profile_background_tile: false,
profile_image_url: "http://pbs.twimg.com/profile_images/739921401629413376/_Pfdcffn_normal.jpg",
profile_image_url_https: "https://pbs.twimg.com/profile_images/739921401629413376/_Pfdcffn_normal.jpg",
profile_banner_url: "https://pbs.twimg.com/profile_banners/16138216/1482963610",
profile_link_color: "D02B55",
profile_sidebar_border_color: "829D5E",
profile_sidebar_fill_color: "99CC33",
profile_text_color: "3E4415",
profile_use_background_image: true,
has_extended_profile: true,
default_profile: false,
default_profile_image: false,
following: false,
follow_request_sent: false,
notifications: false,
translator_type: "none"
},
geo: null,
coordinates: null,
place: null,
contributors: null,
is_quote_status: false,
retweet_count: 130,
favorite_count: 715,
favorited: false,
retweeted: true,
possibly_sensitive: false,
lang: "en"
}

const OriginalTweet = {
  created_at: "Fri Mar 13 19:12:08 +0000 2020",
  id: 1238543383699882000,
  id_str: "1238543383699881985",
  text:
    "Before the 3,000 passengers and crew docked on Monday, officials announced plans to take them to military bases fo… https://t.co/Df0T5l9IfD",
  truncated: true,
  entities: {
    hashtags: [],
    symbols: [],
    user_mentions: [],
    urls: [
      {
        url: "https://t.co/Df0T5l9IfD",
        expanded_url: "https://twitter.com/i/web/status/1238543383699881985",
        display_url: "twitter.com/i/web/status/1…",
        indices: [117, 140]
      }
    ]
  },
  source: "dfdfdf",
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: null,
  in_reply_to_user_id_str: null,
  in_reply_to_screen_name: null,
  user: {
    id: 16129920,
    id_str: "16129920",
    name: "Rachel Maddow MSNBC",
    screen_name: "maddow",
    location: "New York, NY USA",
    description:
      "I see political people... (Retweets do not imply endorsement.)",
    url: "http://t.co/KtNvfeNDMl",
    entities: {
      url: {
        urls: [
          {
            url: "http://t.co/KtNvfeNDMl",
            expanded_url: "http://rachel.msnbc.com",
            display_url: "rachel.msnbc.com",
            indices: [0, 22]
          }
        ]
      },
      description: {
        urls: []
      }
    },
    protected: false,
    followers_count: 10087558,
    friends_count: 3758,
    listed_count: 48655,
    created_at: "Thu Sep 04 15:02:12 +0000 2008",
    favourites_count: 9,
    utc_offset: null,
    time_zone: null,
    geo_enabled: false,
    verified: true,
    statuses_count: 14274,
    lang: null,
    contributors_enabled: false,
    is_translator: false,
    is_translation_enabled: true,
    profile_background_color: "000000",
    profile_background_image_url:
      "http://abs.twimg.com/images/themes/theme1/bg.png",
    profile_background_image_url_https:
      "https://abs.twimg.com/images/themes/theme1/bg.png",
    profile_background_tile: false,
    profile_image_url: "https://source.unsplash.com/random/200x200",
    profile_image_url_https:
      "https://pbs.twimg.com/profile_images/59437078/icon-200x200_normal.jpg",
    profile_link_color: "0000FF",
    profile_sidebar_border_color: "F3F3F3",
    profile_sidebar_fill_color: "FFFFFF",
    profile_text_color: "000000",
    profile_use_background_image: true,
    has_extended_profile: false,
    default_profile: false,
    default_profile_image: false,
    following: false,
    follow_request_sent: false,
    notifications: false,
    translator_type: "none"
  },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  is_quote_status: false,
  retweet_count: 12850,
  favorite_count: 26405,
  favorited: false,
  retweeted: false,
  possibly_sensitive: false,
  lang: 'en'
}

class TweetPost extends Component {
  render () {
    const { classes, account, nickname, votes, postid, weights, previewData, quantiles } = this.props
    return (
      <ErrorBoundary>
        <article className={classes.article}
          style={{ background: 'transparent' }}
        >
          <InteractionData faviconURL={previewData.url}
            nickname={nickname}
            postid={postid}
          />
          <article className={classes.article}>
            {previewData ?
             <Fade in timeout={2000}>
                    <CustomTweetEmbed
              tweetData={null}
            />
          </Fade>
          : null
        }
            <div className={classes.postCaptionHeader}
              width='500px'
            >
              <PostGrid account={account}
                nickname={nickname}
                postid={postid}
                quantiles={quantiles}
                votes={votes}
                weights={weights}
              />
              <Comments postid={postid} />
            </div>
            <Divider className={classes.divider}
              style={{ backgroundColor: 'grey' }}
              variant='middle'
            />
          </article>
        </article>
      </ErrorBoundary>
    )
}
}

const mapStateToProps = (state, ownProps) => {
  const { nickname } = ownProps

  return {
    ...state.scatterRequest,
    level: state.socialLevels.levels[nickname] || {
      isLoading: true,
      error: false,
      levelInfo: {}
    }
  }
}

TweetPost.propTypes = {
  nickname: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  votes: PropTypes.number.isRequired,
  weights: PropTypes.object.isRequired,
  quantiles: PropTypes.object.isRequired,
  postid: PropTypes.number.isRequired,
  account: PropTypes.object.isRequired,
  previewData: PropTypes.object
}

export default connect(mapStateToProps)(withStyles(styles)(TweetPost))
