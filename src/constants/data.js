import ImgFeedDailyHits from '../../public/images/feeds/dailyhitscover.png';
import ImgFeedSmart from '../../public/images/feeds/smartcover.png';
import ImgFeedLol from '../../public/images/feeds/lolcover.png';
import ImgFeedPopular from '../../public/images/feeds/popularcover.png';
import ImgFeedPolitics from '../../public/images/feeds/politicscover.png';
import ImgFeedSafe from '../../public/images/feeds/safecover.png';
import ImgFeedCrypto from '../../public/images/feeds/cryptocover.png';
import ImgFeedNft from '../../public/images/feeds/nftcover.png';
import ImgFeedMirror from '../../public/images/feeds/mirrorcover.png';
import ImgFeedFarcaster from '../../public/images/feeds/farcastercover.png';
import { Typography } from '@mui/material'
import StyledTourResources from '../components/Tour/StyledTourResources'
import React from 'react'
import ReactPlayer from 'react-player/lazy'
import { EXPLAINER_VIDEO } from './const'

export const FEED_CATEGORIES = {
  DAILY_HIT: {
    id: 'dailyhits',
    title: 'Your Daily Hits',
    image: ImgFeedDailyHits,
    metaTitle: 'Daily Hits • Yup',
    description: 'Top content of the day based on general influence'
  },
  POPULAR: {
    id: 'latenightcool',
    title: 'Popular',
    image: ImgFeedPopular,
    metaTitle: 'Popular • Yup',
    description: 'Top content based on the like category'
  },
  POLITICS: {
    id: 'politics',
    title: 'Politics',
    image: ImgFeedPolitics,
    metaTitle: 'The Race • Yup',
    description: 'Top content related to current politics'
  },
  NON_CORONA: {
    id: 'non-corona',
    title: 'Safe Space',
    image: ImgFeedSafe,
    metaTitle: 'Safe Space • Yup',
    description:
      'A feed free from virus-related content. Providing clarity and well-being in hard and confusing times.'
  },
  CRYPTO: {
    id: 'crypto',
    title: 'Crypto',
    image: ImgFeedCrypto,
    metaTitle: 'Crypto • Yup',
    description: 'The top crypto content out there'
  },
  NFT: {
    id: 'nfts',
    title: 'NFT Gallery',
    image: ImgFeedNft,
    metaTitle: 'NFTs • Yup',
    description: 'Non-fungibility for days'
  },
  MIRROR: {
    id: 'mirror',
    title: 'Mirror Articles',
    image: ImgFeedMirror,
    metaTitle: 'Mirror Feed',
    description: 'Live feed of the best articles across all Mirror publications'
  },
  NEW: {
    id: 'new',
    title: 'New',
    image: ImgFeedDailyHits,
    metaTitle: 'New Feed',
    description: 'New Feed'
  },
  FARCASTER: {
    id: 'farcaster',
    title: 'Farcaster',
    image: ImgFeedFarcaster,
    metaTitle: 'Farcaster Feed',
    description: 'Farcaster Feed'
  },
  DEFAULT: {
    // default category info
    id: '',
    title: '',
    image: ImgFeedDailyHits,
    metaTitle: 'Yup • Social Network for Curators',
    description: 'Yup • Social Layer for the Internet'
  }
};

export const PROFILE_TUTORIAL_STEPS = [
  {
    selector: '.Tour-ProfileUsername',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          👩‍🚀 User Profile
        </Typography>
        <p className="tourText">
          Where you'll find important information on each user as well as
          yourself!
        </p>
        <a
          href="https://docs.yup.io"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-Influence',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          💯 Yup Score
        </Typography>
        <p className="tourText">
          A score out of 100 showing how influential a user is. The higher the
          number, the more powerful your opinions!
        </p>
        <a
          href="https://docs.yup.io/basic/colors"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-YUPBalance',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          💰 YUP Balance
        </Typography>
        <p className="tourText">
          The amount of YUP tokens you've earned. Rate any piece of content to
          earn more!
        </p>
        <a
          href="https://docs.yup.io/protocol/yup-protocol#yup-token"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-ProfileFeed',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📰 User Feed
        </Typography>
        <p className="tourText">
          This is this user's rated content, aggregated into a feed.
        </p>
      </div>
    )
  },
  {
    selector: '.Tour-Collections',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📚 Collections
        </Typography>
        <p className="tourText">
          These are curated, personal collections. Create your own, add your
          favorite pieces of content, and share with the world.
        </p>
      </div>
    )
  },
  // {
  //   selector: '.Tour-FeedsDrawer',
  //   content: (
  //     <div>
  //       <Typography className="tourHeader" variant="h4">
  //         📡 Feeds
  //       </Typography>
  //       <p className="tourText">These are your feeds.</p>
  //       <a
  //         href="https://docs.yup.io/products/app#feed"
  //         target="_blank"
  //         className="tourLink"
  //         rel="noreferrer"
  //       >
  //         Learn more
  //       </a>
  //     </div>
  //   )
  // },
  {
    selector: '.Tour-Search',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          🔍 Search
        </Typography>
        <p className="tourText">
          Search for friends and influencers across the web.
        </p>
      </div>
    )
  },
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📈 Leaderboard
        </Typography>
        <p className="tourText">
          Find content and users ranked by category and platform.
        </p>
        <a
          href="https://docs.yup.io/products/app#lists"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <div>
        <Typography variant="h3" className="tourHeader">
          👏 That's it !
        </Typography>
        <p className="tourText">
          That's all for now. Learn more with some of these resources:
        </p>
        <StyledTourResources />
        <ReactPlayer
          controls
          style={{ overFlow: 'hidden', maxHeight: '200px' }}
          url={EXPLAINER_VIDEO}
          width="100%"
        />
      </div>
    )
  }
];

export const COLLECTIONS_TUTORIAL_STEPS = [
  {
    selector: '.Tour-CollectionPosts',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📰 Collection Posts
        </Typography>
        <Typography variant="body2" className="tourText">
          These are the curated posts in this collection.
        </Typography>
      </div>
    )
  },
  {
    selector: '.Tour-RecommendedCollections',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📖 Recommended Collections
        </Typography>
        <Typography variant="body2" className="tourText">
          These are some other collections you should check out!
        </Typography>
      </div>
    )
  },
  // {
  //   selector: '.Tour-FeedsDrawer',
  //   content: (
  //     <div>
  //       <Typography className="tourHeader" variant="h4">
  //         📡 Feeds
  //       </Typography>
  //       <Typography variant="body2" className="tourText">
  //         These are your feeds.
  //       </Typography>
  //       <a
  //         href="https://docs.yup.io/products/app#feed"
  //         target="_blank"
  //         className="tourLink"
  //         rel="noreferrer"
  //       >
  //         Learn more
  //       </a>
  //     </div>
  //   )
  // },
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📈 Leaderboard
        </Typography>
        <Typography variant="body2" className="tourText">
          Find content and users ranked by category and platform.
        </Typography>
        <a
          href="https://docs.yup.io/products/app#lists"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <div>
        <Typography variant="h4" className="tourHeader">
          👏 That's it!
        </Typography>
        <Typography variant="body2" className="tourText">
          That's all for now. Learn more with some of these resources:
        </Typography>
        <StyledTourResources />
      </div>
    )
  }
];

export const LEADERBOARD_TUTORIAL_STEPS = [
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <>
        <Typography className="tourHeader" variant="h4">
          📈 Leaderboard
        </Typography>
        <p className="tourText">
          Find content and users ranked by category and platform.
        </p>
        <a
          href="https://docs.yup.io/products/app#lists"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </>
    )
  },
  {
    selector: '.Tour-LeaderboardMenu',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          ‍📊 Leaderboard Menu
        </Typography>
        <p className="tourText">Here you can edit and filter leaderboards.</p>
      </div>
    )
  },
  {
    selector: '.Tour-Rating',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          🤔 Rating
        </Typography>
        <p className="tourText">
          You can rate content out of 5 in different categories, such as like
          ♥️, smart 💡, funny 😂, etc.
        </p>
        <a
          href="https://docs.yup.io/basic/rating"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  // {
  //   selector: '.Tour-FeedsDrawer',
  //   content: (
  //     <div>
  //       <Typography className="tourHeader" variant="h4">
  //         📡 Feeds
  //       </Typography>
  //       <p className="tourText">These are your feeds.</p>
  //       <a
  //         href="https://docs.yup.io/products/app#feed"
  //         target="_blank"
  //         className="tourLink"
  //         rel="noreferrer"
  //       >
  //         Learn more
  //       </a>
  //     </div>
  //   )
  // },
  {
    selector: '.Tour-Rating',
    content: (
      <div>
        <Typography className="tourHeader" variant="h3">
          👏 That's it !
        </Typography>
        <p className="tourText">
          That's all for now. Learn more with some of these resources:
        </p>
        <StyledTourResources />
        <ReactPlayer
          controls
          style={{ overFlow: 'hidden', maxHeight: '200px' }}
          url={EXPLAINER_VIDEO}
          width="100%"
        />
      </div>
    )
  }
];

export const SEARCH_TUTORIAL_STEPS = [
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          🔍 Search
        </Typography>
        <p className="tourText">
          Search for users and elevant posts across the web.
        </p>
      </div>
    )
  },
  {
    selector: '.Tour-SearchPosts',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📰 Posts
        </Typography>
        <p className="tourText">These are your search results for posts.</p>
      </div>
    )
  },
  {
    selector: '.Tour-SearchUsers',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          👥 Users
        </Typography>
        <p className="tourText">These are the search results for users.</p>
      </div>
    )
  },
  {
    selector: '.Tour-FeedsDrawer',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📡 Feeds
        </Typography>
        <p className="tourText">These are your feeds.</p>
        <a
          href="https://docs.yup.io/products/app#feed"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <div>
        <Typography className="tourHeader" variant="h4">
          📈 Leaderboard
        </Typography>
        <p className="tourText">
          Find content and users ranked by category and platform.
        </p>
        <a
          href="https://docs.yup.io/products/app#lists"
          target="_blank"
          className="tourLink"
          rel="noreferrer"
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '.Tour-LeaderboardButton',
    content: (
      <div>
        <Typography className="tourHeader" variant="h3">
          👏 That's it !
        </Typography>
        <p className="tourText">
          That's all for now. Learn more with some of these resources:
        </p>
        <StyledTourResources />
      </div>
    )
  }
];
