import React, { useEffect, useState } from 'react'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import { PageBody, TopBar } from '../pageLayouts'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Avatar, Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Brand, Other } from '../../utils/colors'
import CountUp from 'react-countup'

const CustomPageBody = styled(PageBody)(
  ({ theme }) => `
  padding-top: ${theme.spacing(12.5)};
`
)

const CustomAvatar = styled(Avatar)(
  ({ theme }) => `
  cursor: pointer;
  background-color: ${theme.palette.M100_OP1};
  :hover {
    background-color: ${theme.palette.M500_OP1};
  }
`)
const CustomPaper = styled(Paper)(
  ({ theme }) => `
  background-image: url(${'/images/graphics/scorecard_bg.svg'}); 
  background-repeat: no-repeat; 
  background-size: cover;
  border-radius: 18px;
  width: 600px;
  padding: 20px;
`)
function ScorePage ({ lightMode }) {
  const [user, setUser] = useState()

  const Score = Math.round(user && user.score)
  const socialLevelColor = Score >= 80 && Score <= 100 ? Brand.mint : Score >= 60 && Score <= 80 ? Other.moss : Score >= 40 && Score <= 60 ? Brand.yellow : Score >= 20 && Score <= 40 ? Brand.orange : Brand.red

  const logo = lightMode ? '/images/graphics/yup-logo-dark.svg' : '/images/graphics/yup-logo.svg'
  const scoreLogo = lightMode ? '/images/graphics/score_logo.svg' : '/images/graphics/score_logo.svg'

  useEffect(() => {
    !user && setUser({ name: 'test', score: 89 })
  }, [])
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
          justifyContent={'center'}>
          <Grid item>
            {user ? (
              <CustomPaper elevation={3}>
                <Grid container
                  direction={'column'}
                  justifyContent={'center'}>
                  <Grid item
                    xs={12}>
                    <Grid container
                      justifyContent={'space-between'}>
                      <Grid item>
                        <Grid container
                          direction='column'>
                          <Grid item>
                            <Typography variant='h4'
                              sx={{ color: '#FEFEFEEE' }}
                            >{user.name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <img
                              src={scoreLogo}
                              alt='scoreLogo'
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <CustomAvatar >
                          <img
                            src='/images/icons/twitter.svg'
                            alt='twitter'
                            width='20px'
                          />
                        </CustomAvatar>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography variant='score'
                      sx={{ color: socialLevelColor }}
                    >
                      <CountUp
                        end={user.score}
                        decimals={2}
                        start={0}
                        duration={1}
                      />
                    </Typography>
                  </Grid>
                </Grid>
              </CustomPaper>) : (<div />)}
          </Grid>
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
  lightMode: PropTypes.bool
}

export default connect(mapStateToProps)(withRouter(((ScorePage))))
