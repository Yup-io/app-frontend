import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import { Grid, Typography, Card, Tabs, Tab } from '@mui/material'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Helmet } from 'react-helmet'
import { useAccount, useConnect, useNetwork, useSigner } from 'wagmi'

import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { YupInput, YupButton, LoadingBar } from '../../components/Miscellaneous'
import LIQUIDITY_ABI from '../../abis/LiquidityRewards.json'
import YUPETH_ABI from '../../abis/YUPETH.json'
import CountUp from 'react-countup'
import axios from 'axios'
import { ethers } from 'ethers'
import { getPolyContractAddresses } from '@yupio/contract-addresses'
import { PageBody } from '../pageLayouts'
import useToast from '../../hooks/useToast'
import { polygonConfig } from '../../config'

const { YUP_DOCS_URL, YUP_BUY_LINK, POLY_CHAIN_ID, REWARDS_MANAGER_API, SUBGRAPH_API_POLY, SUBGRAPH_API_ETH } = process.env

const { POLY_LIQUIDITY_REWARDS, POLY_UNI_LP_TOKEN, ETH_UNI_LP_TOKEN, ETH_LIQUIDITY_REWARDS } = getPolyContractAddresses(Number(POLY_CHAIN_ID))

const toBaseNum = (num) => num / Math.pow(10, 18)
const toGwei = (num) => num * Math.pow(10, 18)
const formatDecimals = (num) => Number(Number(num).toFixed(5))

const styles = theme => ({
  container: {
    minHeight: '100vh',
    maxWidth: '100vw',
    overflowY: 'hidden'
  },
  submitBtnTxt: {
    color: theme.palette.M900
  },
  page: {
    width: '100%',
    margin: '34px 0',
    overflowX: 'hidden'
  },
  submitBtn: {
    background: theme.gradients.horizontal,
    height: '100%'
  },
  aprText: {
    background: '-webkit-linear-gradient(45deg, #00e08e, #f0c909, #eb3650)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  },
  card: {
    padding: 20,
    background: theme.palette.M900,
    border: `1px solid ${theme.palette.M700}`
  },
  counterSizeFixed: {
    width: '360px',
    [theme.breakpoints.down('md')]: {
      width: '250px'
    }
  }
})

const StakingPage = ({ classes }) => {
  const theme = useTheme()
  const { toastError, toastInfo } = useToast()

  const [activePolyTab, setActivePolyTab] = useState(0)
  const [activeEthTab, setActiveEthTab] = useState(0)

  const [ethStakeInput, setEthStakeInput] = useState(0) // amount of eth uni lp to stake
  const [polyStakeInput, setPolyStakeInput] = useState(0) // amount of poly uni lp to stake

  const [polyApr, setPolyApr] = useState(0)
  const [ethApr, setEthApr] = useState(0)

  const [polyRwrdAmt, setPolyRwrdAmt] = useState(0) // amt in rewards poly uni lpto claim
  const [ethRwrdAmt, setEthRwrdAmt] = useState(0) // amt in rewards eth uni lp to claim

  const [polyLpBal, setPolyLpBal] = useState(0) // available poly uni lp bal
  const [ethLpBal, setEthLpBal] = useState(0) // available eth uni lp bal

  const [currentStakeEth, setCurrentStakeEth] = useState(0) // current amount staked
  const [currentStakePoly, setCurrentStakePoly] = useState(0) // current amount staked

  const [contracts, setContracts] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [predictedRewardRate, setPredictedRewardRate] = useState(null)
  const [predictedRewards, setPredictedRewards] = useState({ prev: 0, new: 0 })

  const [isLoading, setIsLoading] = useState(false)

  const [{ data: { connected } }] = useConnect()
  const [{ data: ethAccount }] = useAccount()
  const [{ data: networkData }, switchNetwork] = useNetwork()
  const [, getSigner] = useSigner()

  const handleEthTabChange = (e, newTab) => setActiveEthTab(newTab)
  const handlePolyTabChange = (e, newTab) => setActivePolyTab(newTab)
  const handleEthStakeAmountChange = ({ target }) => setEthStakeInput(target.value)
  const handlePolyStakeAmountChange = ({ target }) => setPolyStakeInput(target.value)

  const handleEthStakeMax = () => setEthStakeInput(toBaseNum(!activeEthTab ? ethLpBal : currentStakeEth))
  const handlePolyStakeMax = () => setPolyStakeInput(toBaseNum(!activePolyTab ? polyLpBal : currentStakePoly))
  useEffect(() => {
    getAprs()
  }, [])

  useEffect(() => {
    if (!contracts) { return }
    getBalances()
    getTotalRewards()
  }, [contracts])

  useEffect(() => {
    if (!ethLpBal || !polyLpBal) { return }
    getPredictedRewardRate()
  }, [ethLpBal, polyLpBal])

  useEffect(() => {
    if (!predictedRewardRate) { return }
    updateRewardStream()
  }, [predictedRewardRate])

  useEffect(() => {
    if (!connected) {
      toastInfo('Connect your wallet to see your balance and perform staking actions.')
      return
    }

    if (networkData.chain.id !== polygonConfig.chainId) {
      toastInfo('Please switch network to Polygon to stake.')
      switchNetwork(polygonConfig.chainId)

      return
    }

    getContracts()

    return () => handleDisconnect()
  }, [connected, networkData.chain && networkData.chain.id])

  const updateRewardStream = async () => {
    setTimeout(() => {
      setPredictedRewards((prevState) => ({ prev: prevState.new,
        new: prevState.new + predictedRewardRate }))
      updateRewardStream()
    }, 1000)
  }

  const getContracts = async () => {
    try {
      const signer = await getSigner()
      const polyLiquidity = new ethers.Contract(POLY_LIQUIDITY_REWARDS, LIQUIDITY_ABI, signer)
      const ethLiquidity = new ethers.Contract(ETH_LIQUIDITY_REWARDS, LIQUIDITY_ABI, signer)
      const polyLpToken = new ethers.Contract(POLY_UNI_LP_TOKEN, YUPETH_ABI, signer)
      const ethLpToken = new ethers.Contract(ETH_UNI_LP_TOKEN, YUPETH_ABI, signer)
      setContracts({ polyLpToken, ethLpToken, polyLiquidity, ethLiquidity })
    } catch (err) {
      toastError('An error occured. Try again later.')
      console.log('ERR getting token contracts', err)
    }
  }

  const getTotalRewards = async () => {
    try {
      const { address } = ethAccount
      const polyRewards = (await axios.post(`${SUBGRAPH_API_POLY}`, {
        query: `{
          balances(where: {address: "${address}"}) {
            id
            address
            count
          }
        }`
      })).data

      const ethRewards = (await axios.post(`${SUBGRAPH_API_ETH}`, {
        query: `{
          balances(where: {address: "${address}"}) {
            id
            address
            count
          }
        }`
      })).data
      let earnings = 0
      if (ethRewards && ethRewards.data && ethRewards.data.balances && ethRewards.data.balances.length > 0) {
        const ethRewardsNum = Number(ethRewards.data.balances[0].count)
        earnings += ethRewardsNum && ethRewardsNum > 0 ? ethRewardsNum : 0
      }
      if (polyRewards && polyRewards.data && polyRewards.data.balances && polyRewards.data.balances.length > 0) {
        const polyRewardsNum = Number(polyRewards.data.balances[0].count)
        earnings += polyRewardsNum && polyRewardsNum > 0 ? polyRewardsNum : 0
      }
      earnings > 0 && setEarnings(earnings)
    } catch (err) {
      toastError('An error occured. Try again later.')
      console.log('ERR getting token contracts', err)
    }
  }

  const handleDisconnect = () => {
    setPolyRwrdAmt(null)
    setEthRwrdAmt(null)
    setCurrentStakePoly(null)
    setCurrentStakeEth(null)
    setPolyLpBal(null)
    setEthLpBal(null)
  }

  const getBalances = async () => {
    try {
      const { address: acct } = ethAccount

      const polyBal = await contracts.polyLpToken.balanceOf(acct)
      const polyStake = await contracts.polyLiquidity.balanceOf(acct)
      const ethStake = await contracts.ethLiquidity.balanceOf(acct)
      const ethBal = await contracts.ethLpToken.balanceOf(acct)
      const polyRwrdsEarned = await contracts.polyLiquidity.earned(acct)
      const ethRwrdsEarned = await contracts.ethLiquidity.earned(acct)
      setPolyRwrdAmt(polyRwrdsEarned)
      setEthRwrdAmt(ethRwrdsEarned)
      setCurrentStakePoly(polyStake)
      setCurrentStakeEth(ethStake)
      setPolyLpBal(polyBal)
      setEthLpBal(ethBal)
    } catch (err) {
      toastError('There was a problem fetching your balances, try again.')
      console.log('ERR getting balances', err)
    }
  }
  const getPredictedRewardRate = async () => {
    try {
      const polyBal = await contracts.polyLpToken.balanceOf(POLY_LIQUIDITY_REWARDS)
      const ethBal = await contracts.ethLpToken.balanceOf(ETH_LIQUIDITY_REWARDS)
      const polyRR = await contracts.polyLiquidity.rewardRate()
      const ethRR = await contracts.ethLiquidity.rewardRate()
      const ethPredictedRR = toBaseNum(currentStakeEth) * toBaseNum(ethRR) / toBaseNum(ethBal)
      const polyPredictedRR = toBaseNum(currentStakePoly) * toBaseNum(polyRR) / toBaseNum(polyBal)
      setPredictedRewardRate(ethPredictedRR + polyPredictedRR)
    } catch (err) {
      toastError('There was a problem fetching your balances, try again.')
      console.log('ERR getting balances', err)
    }
  }

  const getAprs = async () => {
    try {
      const ethApr = (await axios.get(`${REWARDS_MANAGER_API}/aprs/eth`)).data
      const polyApr = (await axios.get(`${REWARDS_MANAGER_API}/aprs/poly`)).data
      setEthApr(ethApr)
      setPolyApr(polyApr)
    } catch (err) {
      console.log('ERR fetching rwrds and aprs', err)
    }
  }

  const handleStakingAction = async (lpToken) => {
    setIsLoading(true)
    if (lpToken === 'eth') {
      await handleEthStakeAction()
    } else if (lpToken === 'poly') {
      await handlePolyStakeAction()
    }
    setIsLoading(false)
  }

  const isInvalidStakeAmt = (amt) => {
    const stakeAmt = Number(amt)
    return isNaN(stakeAmt) || stakeAmt <= 0
  }

  const handleEthStakeAction = async () => {
    if (isInvalidStakeAmt(ethStakeInput)) {
      toastError('Please enter a valid amount.')
      return
    }

    try {
      const isStake = !activeEthTab
      const stakeAmt = (ethers.utils.parseEther(ethStakeInput.toString())).toString()
      const { ethLpToken, ethLiquidity } = contracts

      const approveTransaction = await ethLpToken.approve(ETH_LIQUIDITY_REWARDS, stakeAmt)
      await approveTransaction.wait()

      if (isStake) {
        const stakeTransaction = await ethLiquidity.stake(stakeAmt)
        await stakeTransaction.wait()
      } else {
        const unstakeTransaction = await ethLiquidity.unstake(stakeAmt)
        await unstakeTransaction.wait()
      }

      const updatedLpBal = isStake ? toBaseNum(ethLpBal) - Number(ethStakeInput) : toBaseNum(ethLpBal) + Number(ethStakeInput)
      const updatedStake = isStake ? toBaseNum(currentStakeEth) + Number(ethStakeInput) : toBaseNum(currentStakeEth) - Number(ethStakeInput)
      setEthLpBal(toGwei(updatedLpBal)) // optimistic balance update
      setCurrentStakeEth(updatedStake * Math.pow(10, 18)) // optimistic stake update
    } catch (err) {
      if (err && err.code && err.code !== 4001) {
        toastError('User rejected transaction.')// Dont logout if user rejects transaction
      } else {
        toastError(`We encountered a problem. ${err.message}`)
        console.log('ERR handling eth staking', err)
      }
    }
  }

  const handlePolyStakeAction = async () => {
    if (isInvalidStakeAmt(polyStakeInput)) {
      toastError('Please enter a valid amount.')
      return
    }

    try {
      const isStake = !activePolyTab
      const stakeAmt = (ethers.utils.parseEther(polyStakeInput.toString())).toString()
      const { polyLpToken, polyLiquidity } = contracts

      const approveTransaction = await polyLpToken.approve(POLY_LIQUIDITY_REWARDS, stakeAmt)
      await approveTransaction.wait()

      if (isStake) {
        const stakeTransaction = await polyLiquidity.stake(stakeAmt)
        await stakeTransaction.wait()
      } else {
        const unstakeTransaction = await polyLiquidity.unstake(stakeAmt)
        await unstakeTransaction.wait()
      }

      const updatedLpBal = isStake ? toBaseNum(polyLpBal) - Number(polyStakeInput) : toBaseNum(polyLpBal) + Number(polyStakeInput)
      const updatedStake = isStake ? toBaseNum(currentStakePoly) + Number(polyStakeInput) : toBaseNum(currentStakePoly) - Number(polyStakeInput)
      setPolyLpBal(toGwei(updatedLpBal)) // optimistic balance update
      setCurrentStakePoly(toGwei(updatedStake)) // optimistic stake update
    } catch (err) {
      if (err && err.code && err.code !== 4001) {
        toastError('User rejected transaction.')
      } else {
        toastError(`We encountered a problem. ${err.message}`)
      }
    }
  }

  const collectRewards = async () => {
    try {
      setIsLoading(true)
      toastInfo('Sign the transactions to collect you rewards. There will be one transaction for each pool you are in.')
      const { ethLiquidity, polyLiquidity } = contracts
      if (ethRwrdAmt > 0) {
        const transaction = await ethLiquidity.getReward()
        await transaction.wait()
        setEthRwrdAmt(0)
      }
      if (polyRwrdAmt > 0) {
        const transaction = await polyLiquidity.getReward()
        await transaction.wait()
        setPolyRwrdAmt(0)
      }
      toastInfo('You have succesfully collected your rewards!')
      setIsLoading(false)
    } catch (err) {
      if (err && err.code && err.code === 4001) {
        toastError('User rejected transaction.')
      } else {
        toastError(`We encountered a problem. ${err.message}`)
      }
    }
  }
  return (
    <ErrorBoundary>
      <Helmet>
        <meta charSet='utf-8' />
        <title> Yup Staking </title>
        <meta property='description'
          content='A page for claiming YUP and YUPETH associated with your Yup account, essentially migrating it to the Polygon blockchain.'
        />
        <meta property='image'
          content='https://app-meta-images.s3.amazonaws.com/migrationthumbnail.jpg'
        />
        <meta name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content='Yup Polygon Migration'
        />
        <meta name='twitter:site'
          content='@yup_io'
        />
        <meta
          name='twitter:description'
          content='A page for claiming YUP and YUPETH associated with your Yup account, essentially migrating it to the Polygon blockchain.'
        />
        <meta
          name='twitter:image'
          content='https://app-meta-images.s3.amazonaws.com/migrationthumbnail.jpg'
        />
        <meta
          property='og:title'
          content='Yup Polygon Migration'
        />
        <meta
          property='og:description'
          content='A page for claiming YUP and YUPETH associated with your Yup account, essentially migrating it to the Polygon blockchain.'
        />
        <meta property='og:image'
          content='https://app-meta-images.s3.amazonaws.com/migrationthumbnail.jpg'
        />
      </Helmet>
      <Grid container
        className={classes.container}
      >
        <PageBody scrollable>
          <Grid className={classes.page}
            container
            direction='column'
            justifyContent='center'
            alignItems='start'
            rowSpacing={{ xs: 1, sm: 3, md: 5 }}
          >
            <LoadingBar isLoading={isLoading} />
            <Grid item>
              <Grid
                container
                direction='column'
                spacing={2}
              >
                <Grid item>
                  <Typography variant='subtitle1'>
                      Provide liquidity, earn up to
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='h1'
                    className={classes.aprText}
                  >
                    <CountUp
                      end={Math.max(polyApr, ethApr)}
                      decimals={2}
                      start={0}
                      duration={3}
                      suffix={'% APR'}
                    />
                  </Typography>
                </Grid>
                <Grid item
                  container
                  direction='row'
                  spacing={2}
                >
                  <Grid item>
                    <YupButton
                      color='secondary'
                      variant='outlined'
                      href={YUP_BUY_LINK}
                      target='_blank'
                    > Buy YUP </YupButton>
                  </Grid>
                  <Grid item>
                    <YupButton
                      color='secondary'
                      variant='outlined'
                      href={`${YUP_DOCS_URL}/protocol/yup-protocol`}
                      target='_blank'
                    > Learn More </YupButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid
                container
                direction='row'
                justifyContent='space-between'
                alignItems='start'
                spacing={5}
              >
                <Grid item
                  xs={12}
                  md={6}
                >
                  <Grid
                    container
                    direction='row'
                    spacing={4}
                  >
                    <Grid item
                      xs={3}
                    >
                      <img style={{ width: '100%' }}
                        src='images/graphics/yupeth.svg'
                        alt='yupeth graphic'
                      />
                    </Grid>
                    <Grid item
                      xs={9}
                    >
                      <Grid
                        container
                        direction='column'
                        spacing={2}
                      >
                        <Grid item>
                          <Typography variant='subtitle1'>
                              Stake YUP-ETH LP Tokens
                            <br />
                              Uniswap V2 • Ethereum
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='h5'>
                            {`${ethApr && formatDecimals(ethApr)}% APR`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item
                      xs
                    >
                      <Grid item>
                        <Card
                          className={classes.card}
                          elevation={0}
                        >
                          <Grid
                            container
                            direction='column'
                            spacing={2}
                          >
                            <Grid item>
                              <Tabs
                                value={activeEthTab}
                                onChange={handleEthTabChange}
                                TabIndicatorProps={{ style: { background: theme.gradients.horizontal } }}
                              >
                                <Tab label='Staked' />
                                <Tab label='Unstaked' />
                              </Tabs>
                            </Grid>
                            <Grid item
                              xs={12}
                            >
                              <Grid
                                container
                                direction='column'
                                spacing={2}
                              >
                                <Grid item>
                                  <Grid
                                    container
                                    direction='row'
                                    spacing={1}
                                  >
                                    <Grid item
                                      xs
                                    >
                                      <Grid
                                        container
                                        justifyContent='space-between'
                                      >
                                        <YupInput
                                          fullWidth
                                          id='stake-amount'
                                          maxLength='10'
                                          type='number'
                                          variant='outlined'
                                          size='small'
                                          value={ethStakeInput}
                                          onChange={handleEthStakeAmountChange}
                                          endAdornment={<YupButton size='xs'
                                            variant='text'
                                            color='secondary'
                                            onClick={handleEthStakeMax}
                                          >Max</YupButton>}
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid item>
                                      <ConnectButton.Custom>
                                        {({ openConnectModal }) => (
                                          <YupButton
                                            size='large'
                                            variant='contained'
                                            className={classes.submitBtn}
                                          >
                                            <Typography
                                              variant='body1'
                                              className={classes.submitBtnTxt}
                                              onClick={() => {
                                                if (connected) {
                                                  handleStakingAction('eth')
                                                } else {
                                                  openConnectModal()
                                                }
                                              }}
                                            >
                                              {connected ? activeEthTab ? 'Unstake' : 'Stake' : 'Connect'}
                                            </Typography>
                                          </YupButton>
                                        )}
                                      </ConnectButton.Custom>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <Grid
                                    container
                                    direction='column'
                                  >
                                    <Grid item>
                                      <Grid container
                                        direction='row'
                                        justifyContent='space-between'
                                      >
                                        <Grid item>
                                          <Typography variant='body2'>
                                              UNI V2 YUP-ETH LP in wallet:
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography variant='body2'>
                                            {formatDecimals(toBaseNum(ethLpBal))}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      <Grid item>
                                        <Grid
                                          container
                                          direction='row'
                                          justifyContent='space-between'
                                        >
                                          <Grid item>
                                            <Typography variant='body2'>
                                                Staked:
                                            </Typography>
                                          </Grid>
                                          <Grid item>
                                            <Typography variant='body2'>
                                              {formatDecimals(toBaseNum(currentStakeEth))}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item
                  xs={12}
                  md={6}
                >
                  <Grid
                    container
                    direction='row'
                    spacing={4}
                  >
                    <Grid item
                      xs={3}
                    >
                      <img style={{ width: '100%' }}
                        src='images/graphics/yupmatic.svg'
                        alt='yupmatic graphic'
                      />
                    </Grid>
                    <Grid item
                      xs={9}
                    >
                      <Grid
                        container
                        direction='column'
                        spacing={2}
                      >
                        <Grid item>
                          <Typography variant='subtitle1'>
                              Stake YUP-WETH LP Tokens <br /> Quickswap • Polygon
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='h5'>
                            {`${polyApr && formatDecimals(polyApr)}% APR`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item
                      xs
                    >
                      <Grid item>
                        <Card
                          className={classes.card}
                          elevation={0}
                        >
                          <Grid
                            container
                            direction='column'
                            spacing={2}
                          >
                            <Grid item>
                              <Tabs
                                value={activePolyTab}
                                onChange={handlePolyTabChange}
                                TabIndicatorProps={{ style: { background: theme.gradients.horizontal } }}
                              >
                                <Tab label='Staked' />
                                <Tab label='Unstaked' />
                              </Tabs>
                            </Grid>
                            <Grid item
                              xs={12}>
                              <Grid
                                container
                                direction='column'
                                spacing={2}
                              >
                                <Grid item>
                                  <Grid
                                    container
                                    direction='row'
                                    spacing={1}
                                  >
                                    <Grid item
                                      xs
                                    >
                                      <Grid
                                        container
                                        justifyContent='space-between'
                                      >
                                        <YupInput
                                          fullWidth
                                          id='stake-amount'
                                          maxLength='10'
                                          type='number'
                                          variant='outlined'
                                          size='small'
                                          value={polyStakeInput}
                                          onChange={handlePolyStakeAmountChange}
                                          endAdornment={<YupButton size='xs'
                                            variant='text'
                                            onClick={handlePolyStakeMax}
                                            className={classes.maxBtn}
                                          >Max</YupButton>}
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid item>
                                      <ConnectButton.Custom>
                                        {({ openConnectModal }) => (
                                          <YupButton
                                            size='large'
                                            variant='contained'
                                            className={classes.submitBtn}
                                            onClick={() => {
                                              if (connected) {
                                                handleStakingAction('poly')
                                              } else {
                                                openConnectModal()
                                              }
                                            }}
                                          >
                                            <Typography
                                              variant='body1'
                                              className={classes.submitBtnTxt}
                                            >
                                              {connected ? activePolyTab ? 'Unstake' : 'Stake' : 'Connect'}
                                            </Typography>
                                          </YupButton>
                                        )}
                                      </ConnectButton.Custom>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item>
                                  <Grid
                                    container
                                    direction='column'
                                  >
                                    <Grid item>
                                      <Grid container
                                        direction='row'
                                        justifyContent='space-between'
                                      >
                                        <Grid item>
                                          <Typography variant='body2'>
                                          UNI V2 YUP-WETH LP in wallet:
                                          </Typography>
                                        </Grid>
                                        <Grid item>
                                          <Typography variant='body2'>
                                            {formatDecimals(toBaseNum(polyLpBal))}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                      <Grid item>
                                        <Grid
                                          container
                                          direction='row'
                                          justifyContent='space-between'
                                        >
                                          <Grid item>
                                            <Typography variant='body2'>
                                            Staked:
                                            </Typography>
                                          </Grid>
                                          <Grid item>
                                            <Typography variant='body2'>
                                              {formatDecimals(toBaseNum(currentStakePoly))}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item
              alignSelf={'center'}>
              <Grid
                container
                direction='column'
                justifyContent='center'
                alignItems='center'
                spacing={3}
              >
                <Grid item
                  container
                  justifyContent='space-between'
                  alignItems='center'
                  spacing={5}
                >
                  <Grid item>
                    <Typography variant='h5'>
                      Rewards to Collect
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='body2'>
                      What’s this?
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item
                  container
                  justifyContent='center'
                  alignItems='center'
                  spacing={2}
                >
                  <Grid item
                    className={classes.counterSizeFixed}
                  >
                    <Typography variant='h3'>
                      {toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt) === 0 ? (0 + ' YUP') : (
                        <CountUp
                          end={toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt) + predictedRewards.new}
                          start={toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt) + predictedRewards.prev}
                          decimals={5}
                          duration={1}
                          suffix={' YUP'}
                        />)}
                    </Typography>
                    {/* <YupInput
                                      fullWidth
                                      id='stake-amount'
                                      maxLength='10'
                                      type='number'
                                      variant='outlined'
                                      size='small'
                                      disabled
                                      value={formatDecimals(toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt))}
                                      startAdornment={
                                        <InputAdornment position='start'>
                                          <img src='public/images/logos/logo_g.svg' />
                                        </InputAdornment>
                                            }
                                          /> */}
                  </Grid>
                  { (!connected ? true : (toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt)) > 0) && (
                    <Grid item>
                      <ConnectButton.Custom>
                        {({ openConnectModal }) => (
                          <YupButton
                            size='large'
                            variant='contained'
                            className={classes.submitBtn}
                            onClick={() => {
                              if (connected) {
                                collectRewards()
                              } else {
                                openConnectModal()
                              }
                            }}
                          >
                            <Typography
                              variant='body1'
                              className={classes.submitBtnTxt}
                            >
                              {connected ? 'Collect' : 'Connect'}
                            </Typography>
                          </YupButton>
                        )}
                      </ConnectButton.Custom>
                    </Grid>)}
                </Grid>
                {earnings && (
                  <Grid item
                    container
                    justifyContent='center'
                    alignItems='center'
                    spacing={2}
                  >
                    <Grid item>
                      <Typography variant='subtitle2'>
                        {formatDecimals(toBaseNum(earnings) + toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt) + predictedRewards.new)} YUP Earned in Total
                      </Typography>
                      {/* <YupInput
                                      fullWidth
                                      id='stake-amount'
                                      maxLength='10'
                                      type='number'
                                      variant='outlined'
                                      size='small'
                                      disabled
                                      value={formatDecimals(toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt))}
                                      startAdornment={
                                        <InputAdornment position='start'>
                                          <img src='public/images/logos/logo_g.svg' />
                                        </InputAdornment>
                                            }
                                          /> */}
                    </Grid>
                  </Grid>)}
              </Grid>
            </Grid>
          </Grid>
        </PageBody>
      </Grid>
    </ErrorBoundary>
  )
}

const mapStateToProps = state => {
  const { router } = state
  return {
    feed: router.location.query.feed || state.homeFeed.feed,
    query: router.location.query
  }
}

StakingPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default memo(connect(mapStateToProps)(withStyles(styles)(StakingPage)))
