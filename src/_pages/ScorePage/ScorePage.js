import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { PageBody, TopBar } from '../pageLayouts';

import { withRouter, useRouter } from 'next/router';
import { Grid, Typography, Icon } from '@mui/material';
import { styled } from '@mui/material/styles';
import { YupInput, YupButton } from '../../components/Miscellaneous';
import axios from 'axios';
import TopAddresses from '../../components/ScorePage/TopAddresses';
import EnsCard from '../../components/ScorePage/EnsCard';
import ScoreCard from '../../components/ScorePage/ScoreCard';
import DegenStripe from '../../components/ScorePage/DegenStripe';
import DataCard from '../../components/ScorePage/DataCard';
import useToast from '../../hooks/useToast';
import { useThemeMode } from '../../contexts/ThemeModeContext';
import { apiBaseUrl } from '../../config';
import ColorText from '../../components/ScorePage/ColorText';

const text1 = (
  <Typography display="inline" variant="h4">
    Holy{' '}
    <Typography display="inline" variant="scoreText">
      DAO
    </Typography>
    ! You’re definitey{' '}
    <Typography display="inline" variant="scoreText">
      GMI
    </Typography>{' '}
    damn
  </Typography>
);

const text2 = (
  <Typography display="inline" variant="h4">
    Look at you{' '}
    <Typography display="inline" variant="scoreText">
      contributing
    </Typography>
    and shit! If I was a betting ape I’d go with
    <Typography display="inline" variant="scoreText">
      gmi
    </Typography>
  </Typography>
);

const text3 = (
  <Typography display="inline" variant="h4">
    tbh{' '}
    <Typography display="inline" variant="scoreText">
      can’t
    </Typography>{' '}
    confidently say you’re{' '}
    <Typography display="inline" variant="scoreText">
      gmi
    </Typography>
  </Typography>
);

const text4 = (
  <Typography display="inline" variant="h4">
    I smell vanilla... let’s try another{' '}
  </Typography>
);

const CustomPageBody = styled(PageBody)(
  ({ theme }) => `
  min-height: 100vh;
  padding-top: ${theme.spacing(12.5)};
  padding-bottom: ${theme.spacing(6)};
`
);


function ScorePage() {
  const { isLightMode } = useThemeMode();
  const { toastError } = useToast();
  const { push, query } = useRouter();
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [ens, setEns] = useState();
  const [scoreData, setScoreData] = useState();
  const [relatedScores, setRelatedScores] = useState([]);
  const [newAddress, setAddress] = useState('');
  const score = Math.round(user && user.score);
  const text =
    score >= 80 && score <= 100
      ? text1
      : score >= 60 && score <= 80
      ? text1
      : score >= 40 && score <= 60
      ? text2
      : score >= 20 && score <= 40
      ? text3
      : text4;
  const address = query.address;
  const logo = isLightMode
    ? '/images/graphics/yup-logo-dark.svg'
    : '/images/graphics/yup-logo.svg';

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault();
    newSearch();
  };
  const newSearch = () => {
    newAddress && push('/score/' + newAddress);
  };
  const getScore = async () => {
    try {
      const { data } = (
        await axios.get(`${apiBaseUrl}/score?address=${address}`)
      ).data;
      const relatedAddresses = [
        ...(data.score_data.recent_eth_transfers.related_addresses || []),
        ...(data.score_data.recent_polygon_transfers.related_addresses || [])
      ];
      getScoresForRelated(relatedAddresses.slice(0, 6));
      setUser({ name: address, score: data.yup_score });
      setScoreData({ ...data.score_data });
      setEns({
        count: data.score_data.ens.count,
        domains: data.score_data.ens.domains,
        score: data.score_data.ens.score
      });
    } catch (error) {
      toastError(error?.response?.data?.error || 'An error has occurred');
      setError(true)
      console.log(error);
    }
  };

  const getScoresForRelated = async (addresses) => {
    try {
      let requests = addresses.map((address) => {
        return axios.get(`${apiBaseUrl}/score?address=${address}`);
      });
      const scores = await Promise.all(requests);
      const relatedScores = scores.map((score) => {
        return { name: score.data.data.id, score: score.data.data.score };
      });
      setRelatedScores(relatedScores);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddressChange = ({ target }) => setAddress(target.value);

  useEffect(() => {
    if (address) {
      (!user || user.name !== address) && getScore();
    }
  }, [address]);

  const hordor =
    scoreData?.eth_nfts?.score > 0 ||
    scoreData?.polygon_nfts?.score > 0 ||
    scoreData?.gnosis_nfts?.score > 0;
  const namor = scoreData?.ens?.count > 0;
  const smallcap = scoreData?.eth_erc20_tokens?.tokens_held > 0;
  const ethBalance = scoreData?.eth_balance?.balance;
  const ethAge = scoreData?.eth_age?.age;
  const txns = scoreData?.eth_txn_count?.count;
  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet="utf-8" />
        <title> </title>
        <meta property="description" content="" />
        <meta property="image" content="" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="" />
        <meta name="twitter:site" content="@yup_io" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
      </Helmet>
      <TopBar>
        <Grid container justifyContent={'center'} sx={{ padding: '1rem' }}>
          <Grid item>
            <img
              src={logo}
              style={{ width: '41px', height: '34px' }}
              alt="yup logo"
            />
          </Grid>
        </Grid>
      </TopBar>
      <CustomPageBody >
        <Grid
          container
          direction="column"
          alignItems={'center'}
          justifyContent={'center'}
          spacing={5}
        >
        {score&&(
          <Grid item xs={12}>
            <ScoreCard score={score} user={user} />
          </Grid>
          )}
          {score&&(
          <Grid item xs={12}>
            {text}
          </Grid>)}
          <Grid item xs={12}>
            <YupInput
              id="description"
              placeholder={'Enter Eth address'}
              onKeyDown={handleKeyDown}
              onChange={handleAddressChange}
              type="text"
              endAdornment={
                <YupButton
                  variant="outlined"
                  color="secondary"
                  onClick={newSearch}
                  style={{ maxWidth: 'unset', width: 'unset' }}
                >
                  <Icon
                    fontSize="small"
                    className="fal fa-check"
                    style={{ marginRight: '5px' }}
                  />
                  <Typography variant="subtitle2">enter</Typography>
                </YupButton>
              }
              round
              noBackgroundColor
            />
          </Grid>

          {score&&(
          <Grid item>
          <Grid item>
            <Typography variant="body1">what made your score</Typography>
          </Grid>
          {relatedScores?.length > 0 && (
            <Grid item xs={12}>
              <TopAddresses addresses={relatedScores} />
            </Grid>
          )}
          {ens && ens.count > 0 && (
            <EnsCard
              addresses={ens.domains}
              count={ens.count}
              score={ens.score}
            />
          )}
          <DegenStripe score={score} />
          <ColorText score={score}></ColorText>
          <Grid item xs={12}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  direction={{ xs: 'column', lg: 'row' }}
                  spacing={{ xs: 2, lg: 12 }}
                >
                  {smallcap && (
                    <Grid item>
                      <DataCard
                        title={'Small-Cap Savage'}
                        subtitle={'Holds Several ERC-20 Tokens'}
                        desc={
                          'You get rich or get rugged trying in the altcoin game 😤'
                        }
                      />
                    </Grid>
                  )}

                  {hordor && (
                    <Grid item sx={{ marginTop: { lg: smallcap && '250px' } }}>
                      <DataCard
                        title={'The Hordoooooor'}
                        subtitle={'Purchased Several NFTs'}
                        desc={"Excellent taste, monsieur *chef's kiss*"}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {namor && (
                <Grid
                  item
                  sx={{
                    paddingTop: (theme) => theme.spacing(2),
                    marginTop: { lg: '75px' }
                  }}
                >
                  <DataCard
                    title={'NAMOOOOOOOR'}
                    subtitle={'Owns ENS Domains'}
                    desc={
                      "Just can't help yourself but register every name, can you? Save some names for the rest of us."
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="column" alignItems="center">
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  direction={{ xs: 'column', lg: 'row' }}
                  spacing={{ xs: 2, lg: 12 }}
                >
                  {ethAge && (
                    <Grid item>
                      <DataCard
                        title={'Your account age'}
                        subtitle={ethAge?.toFixed(0) + ' days'}
                        desc={'Good my padawan'}
                        noGradient
                      />
                    </Grid>
                  )}
                  {txns > 0 && (
                    <Grid item sx={{ marginTop: { lg: ethAge && '250px' } }}>
                      <DataCard
                        title={'Total transactions'}
                        subtitle={txns}
                        desc={'Good start'}
                        noGradient
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {ethBalance > 0 && (
                <Grid
                  item
                  sx={{
                    paddingTop: (theme) => theme.spacing(2),
                    marginTop: { lg: '50px' }
                  }}
                >
                  <DataCard
                    title={'Your ETH balance'}
                    subtitle={ethBalance.toFixed(3) + ' ETH'}
                    desc={'Baby shark do do do'}
                    noGradient
                    sx={{
                      marginTop: { lg: '100px' }
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          {ethAge && (
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={10} md={8} lg={7}>
                  <Typography variant="h3" align="center">
                    your account has been on the blockchain
                  </Typography>
                  <Typography variant="h6" align="center">
                    <Typography variant="score">
                      {ethAge?.toFixed(0)}
                    </Typography>
                    days
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          </Grid>
          )}
        </Grid>
      </CustomPageBody>
    </ErrorBoundary>
  );
}

export default withRouter(ScorePage);
