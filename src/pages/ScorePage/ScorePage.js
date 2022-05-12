import React, { useEffect, useState } from 'react'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { PageBody, TopBar } from '../pageLayouts'
import { connect } from 'react-redux'
import { useParams, withRouter } from 'react-router'
import { Grid, Typography, Icon } from '@mui/material'
import { styled } from '@mui/material/styles'
import { YupInput, YupButton } from '../../components/Miscellaneous'
import axios from 'axios'
import TopAddresses from '../../components/Scorepage/TopAddresses'
import EnsCard from '../../components/Scorepage/EnsCard'
import ScoreCard from '../../components/Scorepage/ScoreCard'
import DegenStripe from '../../components/Scorepage/DegenStripe'
import DataCard from '../../components/Scorepage/DataCard'

const text1 = <Typography display='inline'
  variant='h4'>Holy <Typography display='inline'
    variant='scoreText'>DAO</Typography>! You’re definitey <Typography display='inline'
    variant='scoreText'>GMI</Typography> damn</Typography>

const text2 = <Typography display='inline'
  variant='h4'>Look at you <Typography display='inline'
    variant='scoreText'>contributing</Typography>and shit!  If I was a betting ape I’d go with<Typography display='inline'
    variant='scoreText'>gmi</Typography></Typography>

const text3 = <Typography display='inline'
  variant='h4'>tbh <Typography display='inline'
    variant='scoreText'>can’t</Typography> confidently say you’re <Typography display='inline'
    variant='scoreText'>gmi</Typography></Typography>

const text4 = <Typography display='inline'
  variant='h4'>I smell vanilla...
  let’s try another </Typography>

const CustomPageBody = styled(PageBody)(
  ({ theme }) => `
  padding-top: ${theme.spacing(12.5)};
`
)

const GreenText = styled(Typography)(
  ({ theme }) => `
    background-image: url(${'/images/graphics/green_vector.svg'}); 
    background-repeat: no-repeat; 
  `)
const BACKEND_API = process.env.BACKEND_API

function ScorePage ({ lightMode, history }) {
  const { address } = useParams()
  const [user, setUser] = useState()
  const [ens, setEns] = useState()
  const [scoreData, setScoreData] = useState()
  const [newAddress, setAddress] = useState('')
  const Score = Math.round(user && user.score)
  const text = Score >= 80 && Score <= 100 ? text1 : Score >= 60 && Score <= 80 ? text1 : Score >= 40 && Score <= 60 ? text2 : Score >= 20 && Score <= 40 ? text3 : text4

  const logo = lightMode ? '/images/graphics/yup-logo-dark.svg' : '/images/graphics/yup-logo.svg'
  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') {
      return
    }
    e.preventDefault()
    newSearch()
  }
  const newSearch = () => {
    newAddress && history.push('/' + newAddress + '/score')
  }
  const getScore = async () => {
    try {
      const { data } = (await axios.get(`${BACKEND_API}/score?address=${address}`)).data
      setUser({ name: address, score: data.score })
      setScoreData({ ...data.score_data })
      setEns({ count: data.score_data.ens.count, domains: data.score_data.ens.domains, score: data.score_data.ens.score })
    } catch (err) {
      console.log(err)
    }
  }
  const handleAddressChange = ({ target }) => setAddress(target.value)

  useEffect(() => {
    (!user || user.name !== address) && getScore()
  }, [address])
  console.log(scoreData)
  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet='utf-8' />
        <title>  </title>
        <meta property='description'
          content=''
        />
        <meta property='image'
          content=''
        />
        <meta name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content=''
        />
        <meta name='twitter:site'
          content='@yup_io'
        />
        <meta
          name='twitter:description'
          content=''
        />
        <meta
          name='twitter:image'
          content=''
        />
        <meta
          property='og:title'
          content=''
        />
        <meta
          property='og:description'
          content=''
        />
        <meta property='og:image'
          content=''
        />
      </Helmet>
      <TopBar>
        <Grid container
          justifyContent={'center'}
          sx={{ padding: '1rem' }}>
          <Grid item>
            <img
              src={logo}
              style={{ width: '41px', height: '34px' }}
              alt='yup logo'
            />
          </Grid>
        </Grid>
      </TopBar>
      <CustomPageBody >
        <Grid container
          direction='column'
          alignItems={'center'}
          justifyContent={'center'}
          spacing={3}>

          <Grid item
            xs={12}>
            <ScoreCard score={Score}
              user={user} />
          </Grid>
          <Grid item
            xs={12}>
            {text}
          </Grid>
          <Grid item
            xs={12}>
            <YupInput
              id='description'
              placeholder={'Enter Eth address'}
              onKeyDown={handleKeyDown}
              onChange={handleAddressChange}
              error
              type='text'
              endAdornment={
                <YupButton
                  variant='outlined'
                  color='secondary'
                  onClick={newSearch}
                  style={{ maxWidth: 'unset', width: 'unset' }}
                >
                  <Icon fontSize='small'
                    className='fal fa-check'
                    style={{ marginRight: '5px' }}
                  />
                  <Typography
                    variant='subtitle2'
                  >
                enter
                  </Typography>
                </YupButton>}
              round
              noBackgroundColor
            />
          </Grid>

          <Grid item>
            <Typography variant='body1'
            >what made your score
            </Typography>
          </Grid>

          <Grid item
            xs={12}>
            <TopAddresses />
          </Grid>
          {ens && (
            <EnsCard addresses={ens.domains}
              count={ens.count}
              score={ens.score} />)}
          <DegenStripe score={Score} />
          <Grid item
            xs={12}>
            <Grid container
              justifyContent='center'>
              <Grid item
                xs={10}
                md={8}
                lg={7}>
                <Typography variant='subtitle1'
                  align='center'
                >There are alot of ways your yup score is being calculated here are a few more reasone why you are so
                  <GreenText variant='h5'
                    display='inline'> green</GreenText>
                </Typography>

              </Grid>

            </Grid>
          </Grid>

          <DataCard title={'Small-Cap Savage'}
            subtitle={'Holds Several ERC-20 Tokens'}
            desc={'You get rich or get rugged trying in the altcoin game 😤'} />
          <DataCard title={'The Hordoooooor'}
            subtitle={'Purchased Several NFTs'}
            desc={"Excellent taste, monsieur *chef's kiss*"} />
          <DataCard title={'NAMOOOOOOOR'}
            subtitle={'Owns ENS Domains'}
            desc={"Just can't help yourself but register every name, can you? Save some names for the rest of us."} />
          {scoreData?.eth_age?.age &&
          <DataCard title={'Your account age'}
            subtitle={scoreData.eth_age.age + ' days'}
            desc={'Good my padawan'}
            noGradient />
          }
          <DataCard title={'Total transactions'}
            subtitle={'125'}
            desc={'Good start'}
            noGradient />

          <DataCard title={'Your ETH balance'}
            subtitle={'3eth'}
            desc={'Baby shark do do do'}
            noGradient />
        </Grid>
      </CustomPageBody>
    </ErrorBoundary>)
}

const mapStateToProps = (state) => {
  return {
    lightMode: state.lightMode.active
  }
}

ScorePage.propTypes = {
  lightMode: PropTypes.bool,
  history: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withRouter(((ScorePage))))
