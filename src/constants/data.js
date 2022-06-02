import ImgFeedDailyHits from '../../public/images/feeds/dailyhits.png';
import ImgFeedSmart from '../../public/images/feeds/smartcover.png';
import ImgFeedLol from '../../public/images/feeds/lolcover.png';
import ImgFeedPopular from '../../public/images/feeds/popularcover.png';
import ImgFeedPolitics from '../../public/images/feeds/politicscover.png';
import ImgFeedSafe from '../../public/images/feeds/safecover.png';
import ImgFeedCrypto from '../../public/images/feeds/cryptocover.png';
import ImgFeedNft from '../../public/images/feeds/nftcover.png';
import ImgFeedMirror from '../../public/images/feeds/mirrorcover.png';

export const FEED_CATEGORIES = {
  DAILY_HIT: {
    id: 'dailyhits',
    title: 'Your Daily Hits',
    image: ImgFeedDailyHits,
    metaTitle: 'Daily Hits • Yup',
    description: 'Top content of the day based on general influence'
  },
  FUNNY: {
    id: 'lol',
    title: 'Funny',
    image: ImgFeedLol,
    metaTitle: 'LOL • Yup',
    description: 'Top content based on the funny category'
  },
  SMART: {
    id: 'brainfood',
    title: 'Smart',
    image: ImgFeedSmart,
    metaTitle: 'Smart • Yup',
    description: 'Top content based on the smart category'
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
  DEFAULT: {
    // default category info
    id: '',
    title: '',
    image: ImgFeedDailyHits,
    metaTitle: 'Yup • Social Network for Curators',
    description: 'Yup • Social Layer for the Internet'
  }
};
