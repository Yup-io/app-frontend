import React, { Component, memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withTheme from '@mui/styles/withTheme';
import {
  Grid,
  Typography,
  Fade,
  Grow,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import '../../components/Twitter/twitter.module.css';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Tilt from 'react-tilt';
import axios from 'axios';
import { Mono } from '../../utils/colors.js';
import Img from 'react-image';
import { accountInfoSelector } from '../../redux/selectors';
import HomeMenuLinkItem from './HomeMenuLinkItem';
import { connect } from 'react-redux';
import { YupButton, ResponsiveEllipsis } from '../Miscellaneous';
import { PageBody } from '../../_pages/pageLayouts';
import useStyles from './styles';
import useDevice from '../../hooks/useDevice';
import { apiBaseUrl, landingPageUrl, webAppUrl } from '../../config';
import Link from '../Link';

const DEFAULT_COLLECTION_IMGS = [...Array(5)].map(
  (_, i) => `/images/gradients/gradient${i + 1}.webp`
);
const getRandomGradientImg = () =>
  `${
    DEFAULT_COLLECTION_IMGS[
      Math.floor(Math.random() * DEFAULT_COLLECTION_IMGS.length)
    ]
  }`;

const Home = ({ isUser, userCollections, theme }) => {
  const classes = useStyles();
  const { isMobile } = useDevice();

  const [linkItems, setLinkItems] = useState([]);
  const [cardItems, setCardItems] = useState([]);
  const [recommendedCollections, setRecommendedCollections] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/home-config/v2`)
      .then(({ data: { cardItems, linkItems } }) => {
        setCardItems(cardItems);
        setLinkItems(linkItems);
      });
    axios
      .get(`${apiBaseUrl}/collections/recommended?limit=7`)
      .then(({ data: recommendedCollections }) => {
        setRecommendedCollections(recommendedCollections);
      });
  }, []);

  return (
    <ErrorBoundary>
      <div className={classes.container}>
        <PageBody pageClass={classes.page}>
          <Grid
            className={classes.gridContainer}
            container
            direction="row"
            justifyContent="flex-start"
            rowSpacing={5}
            alignItems="stretch"
          >
            <Grid item xs={12}>
              <Grid container direction="row" spacing={3} alignItems="stretch">
                <Grid item md={12} xs={12}>
                  <Fade in timeout={300}>
                    <Card
                      elevation={0}
                      className={classes.bannerCard}
                      style={{
                        backgroundImage: isUser
                          ? `linear-gradient(to top, ${theme.palette.M500}, ${theme.palette.M600})`
                          : "url('images/feeds/rainbowbanner.svg')"
                      }}
                    >
                      <CardContent>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item xs={isMobile ? 12 : 7}>
                            <Typography
                              variant="h1"
                              className={classes.titlePlain}
                            >
                              {isUser
                                ? `Mirror Feed`
                                : `Social Network for Curators`}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              className={classes.subtitle}
                            >
                              {isUser
                                ? `Explore Mirror articles from all publications, all in one feed`
                                : `Curate and share content across the web. Earn money and clout for your taste`}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            container
                            justifyContent="center"
                            xs={5}
                            style={{ display: isMobile ? 'none' : 'inherit' }}
                          >
                            <Img
                              className={
                                isUser
                                  ? classes.bannerMediaUser
                                  : classes.bannerMediaNews
                              }
                              src={
                                isUser
                                  ? 'images/graphics/mirrorgraphic.png'
                                  : 'images/graphics/coingraphic.png'
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        {isUser ? (
                          <Link className={classes.link} href="/?feed=mirror">
                            <YupButton
                              size="large"
                              variant="contained"
                              color="primary"
                            >
                              Enter
                            </YupButton>
                          </Link>
                        ) : (
                          <>
                            <a
                              className={classes.link}
                              href={`${webAppUrl}/?signupOpen=true`}
                            >
                              <YupButton
                                size="large"
                                variant="contained"
                                color="primary"
                              >
                                Start Now
                              </YupButton>
                            </a>
                            <a
                              className={classes.link}
                              href={landingPageUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <YupButton
                                size="large"
                                variant="outlined"
                                color="secondary"
                              >
                                Learn More
                              </YupButton>
                            </a>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
                {linkItems &&
                  linkItems.map(
                    ({ title, link, onlyVisibleToLoggedUser }, idx) => {
                      if (!isUser && onlyVisibleToLoggedUser) {
                        return;
                      }
                      return (
                        <HomeMenuLinkItem
                          key={idx}
                          title={title}
                          link={link.replace('USER_PLACEHOLDER', isUser)}
                        />
                      );
                    }
                  )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start"
              >
                {cardItems &&
                  cardItems.map((item, index) => {
                    return (
                      <Grid
                        item
                        key={index}
                        xs={6}
                        sm={3}
                        className={classes.imageCardGrid}
                      >
                        <Link href={item.link} className={classes.link}>
                          <Grow in timeout={500}>
                            <Grid
                              container
                              direction="column"
                              alignItems="stretch"
                              spacing={1}
                            >
                              <Grid item>
                                <Tilt
                                  options={{
                                    max: 10,
                                    scale: 1.1,
                                    perspective: 2000
                                  }}
                                >
                                  <Card
                                    elevation={0}
                                    style={{
                                      backgroundImage: `url(${item.imgSrc})`
                                    }}
                                    alt={item.title}
                                    className={classes.imageCard}
                                  >
                                    <Typography
                                      variant="h6"
                                      style={{ color: Mono.M50 }}
                                    >
                                      {item.title}
                                    </Typography>
                                  </Card>
                                </Tilt>
                              </Grid>
                            </Grid>
                          </Grow>
                        </Link>
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ display: isUser ? 'inherit' : 'none' }}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <Fade in timeout={2000}>
                    <Typography variant="h5">Your Collections</Typography>
                  </Fade>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {userCollections &&
                      userCollections.slice(0, 8).map((coll, idx) => {
                        return (
                          <Grid
                            key={idx}
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            className={classes.linkItemContainer}
                          >
                            <Link
                              href={`/collections/${encodeURIComponent(
                                coll.name.replace(/\s+|\//g, '-').toLowerCase()
                              )}/${coll._id}`}
                              className={classes.link}
                            >
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                className={classes.recommendedContainer}
                              >
                                <Grid
                                  item
                                  xs={4}
                                  lg={4}
                                  xl={4}
                                  p={1}
                                  className={classes.recommendedImgContainer}
                                >
                                  <Img
                                    src={[
                                      coll.imgSrcUrl,
                                      getRandomGradientImg()
                                    ]}
                                    alt="thumbnail"
                                    className={classes.recommendedImg}
                                  />
                                </Grid>
                                <Grid item xs={8} lg={8} xl={8} p={1}>
                                  <Typography variant="subtitle1">
                                    <ResponsiveEllipsis
                                      basedOn="letters"
                                      ellipsis="..."
                                      maxLine="2"
                                      text={coll.name}
                                      trimRight
                                    />
                                  </Typography>
                                  <Typography variant="body2">
                                    {coll.postIds.length === 1
                                      ? `1 post`
                                      : `${coll.postIds.length} posts`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Link>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container direction="column">
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Fade in timeout={2000}>
                        <Typography variant="h5">Browse</Typography>
                      </Fade>
                    </Grid>
                    {recommendedCollections &&
                      recommendedCollections.map((coll, idx) => {
                        if (!coll) return null;
                        return (
                          <Grid
                            key={idx}
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            className={classes.linkItemContainer}
                          >
                            <Link
                              href={`/collections/${encodeURIComponent(
                                coll.name.replace('/', '')
                              )}/${coll._id}`}
                              className={classes.link}
                            >
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                className={classes.recommendedContainer}
                              >
                                <Grid
                                  item
                                  xs={4}
                                  lg={4}
                                  xl={4}
                                  p={1}
                                  className={classes.recommendedImgContainer}
                                >
                                  <Img
                                    src={[
                                      coll.imgSrcUrl,
                                      getRandomGradientImg()
                                    ]}
                                    alt="thumbnail"
                                    className={classes.recommendedImg}
                                  />
                                </Grid>
                                <Grid item xs={8} lg={8} xl={8} p={1}>
                                  <Typography variant="subtitle1">
                                    <ResponsiveEllipsis
                                      basedOn="letters"
                                      ellipsis="..."
                                      maxLine="2"
                                      text={coll.name}
                                      trimRight
                                    />
                                  </Typography>
                                  <Typography variant="body2">
                                    {coll.owner}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Link>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </PageBody>
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state) => {
  const account = accountInfoSelector(state);
  const isUser = account && account.name;
  // const accountNotLoaded = state.authInfo.isLoading || (state.authInfo.error && !state.authInfo.isLoading)
  // const cachedUsername = localStorage.getItem('cachedUsername')

  // const isUser = accountNotLoaded ? cachedUsername : accountName

  // if (!cachedUsername && account.name) {
  //   localStorage.setItem('cachedUsername', JSON.stringify(account.name))
  // }
  const { collections: userCollections } =
    state.userCollections[account && account.name] || {};
  return {
    isUser,
    userCollections
  };
};

Home.propTypes = {
  userCollections: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  isUser: PropTypes.bool.isRequired
};

export default memo(connect(mapStateToProps)(withTheme(Home)));
