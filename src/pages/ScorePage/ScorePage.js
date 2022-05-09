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

const BACKEND_API = process.env.BACKEND_API

function ScorePage ({ lightMode, history }) {
  const { address } = useParams()
  const [user, setUser] = useState()
  const [ens, setEns] = useState()
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
      setEns({ count: data.score_data.ens.count, domains: data.score_data.ens.domains, score: data.score_data.ens.score })
    } catch (err) {
      console.log(err)
    }
  }
  const handleAddressChange = ({ target }) => setAddress(target.value)

  useEffect(() => {
    (!user || user.name !== address) && getScore()
  }, [address])

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
          <ScoreCard score={Score}
            user={user} />
          <Grid item>
            {text}
          </Grid>
          <Grid item>
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

            <Typography variant='b1'
            >what made your score
            </Typography>
          </Grid>

          <TopAddresses />
          {ens && (
            <EnsCard addresses={ens.domains}
              count={ens.count}
              score={ens.score} />)}
          <DegenStripe />
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
