import { Helmet } from 'react-helmet';
import React from 'react';
import PropTypes from 'prop-types';

const AIRDROP_IMG = 'https://app-meta-images.s3.amazonaws.com/migration.png';

const MetaTags = ({ polygonAddress, airdrop }) => {
  const metaDescription = polygonAddress
    ? `${polygonAddress.slice(0, 5)}...${polygonAddress.slice(
        -6,
        -1
      )} has ${Math.round(airdrop)} $YUP ready to be airdropped to Polygon`
    : `Claim your airdrop on Polygon`;
  const metaTitle = 'Yup Polygon Aidrop';
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>Yup Airdrop</title>
      <meta property="description" content={metaDescription} />
      <meta property="image" content={AIRDROP_IMG} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:site" content="@yup_io" />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={AIRDROP_IMG} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={AIRDROP_IMG} />
    </Helmet>
  );
};

MetaTags.propTypes = {
  airdrop: PropTypes.string,
  polygonAddress: PropTypes.string
};

export default MetaTags;
