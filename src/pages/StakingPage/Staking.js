import React, { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import { Grid, Typography, Card, Button, Tabs, Tab, Snackbar, SnackbarContent } from '@mui/material'
import { Helmet } from 'react-helmet'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import YupInput from '../../components/Miscellaneous/YupInput'
import ConnectEth from '../../components/ConnectEth/ConnectEth'
import LoadingBar from '../../components/Miscellaneous/LoadingBar'
import { accountInfoSelector } from '../../redux/selectors'
import { getPriceProvider, getWeb3InstanceOfProvider } from '../../utils/eth'
import LIQUIDITY_ABI from '../../abis/LiquidityRewards.json'
import YUPETH_ABI from '../../abis/YUPETH.json'
import CountUp from 'react-countup'
import axios from 'axios'
import { ethers } from 'ethers'
import { getPolyContractAddresses } from '@yupio/contract-addresses'

const { YUP_DOCS_URL, YUP_BUY_LINK, POLY_CHAIN_ID, REWARDS_MANAGER_API, POLY_BACKUP_RPC_URL, SUBGRAPH_API_POLY, SUBGRAPH_API_ETH } = process.env
const POLY_BACKUP_RPC_URLS = POLY_BACKUP_RPC_URL.split(',')

const { POLY_LIQUIDITY_REWARDS, POLY_UNI_LP_TOKEN, ETH_UNI_LP_TOKEN, ETH_LIQUIDITY_REWARDS } = getPolyContractAddresses(Number(POLY_CHAIN_ID))

const toBaseNum = (num) => num / Math.pow(10, 18)
const toGwei = (num) => num * Math.pow(10, 18)
const formatDecimals = (num) => Number(Number(num).toFixed(5))

const styles = theme => ({
  container: {
    minHeight: '100vh',
    maxWidth: '100vw',
    padding: '80px 8vw 80px 8vw',
    overflowY: 'hidden',
    backgroundColor: theme.palette.alt.second,
    [theme.breakpoints.down('sm')]: {
      padding: '80px 2vw 80px 2vw'
    }
  },
  submitBtnTxt: {
    color: theme.palette.alt.second
  },
  page: {
    marginLeft: 0,
    overflowX: 'hidden'
  },
  maxBtn: {
    lineHeight: 0,
    maxWidth: 30,
    height: '100%'
  },
  submitBtn: {
    background: theme.palette.rainbowGradient,
    height: '100%'
  },
  aprText: {
    background: '-webkit-linear-gradient(45deg, #00e08e, #f0c909, #eb3650)',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent'
  },
  card: {
    padding: 20,
    background: theme.palette.alt.second,
    border: `1px solid ${theme.palette.alt.fifth}`
  },
  counterSizeFixed: {
    width: '360px',
    [theme.breakpoints.down('sm')]: {
      width: '250px'
    }
  }
})

const StakingPage = ({ classes, account }) => {
  const { palette } = useTheme()

  const [activePolyTab, setActivePolyTab] = useState(0)
  const [activeEthTab, setActiveEthTab] = useState(0)
  const [ethConnectorDialog, setEthConnectorDialog] = useState(false)

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
  const [retryCount, setRetryCount] = useState(-1) // switch RPC URLs on timeout/fail

  const [contracts, setContracts] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [predictedRewardRate, setPredictedRewardRate] = useState(null)
  const [predictedRewards, setPredictedRewards] = useState({ prev: 0, new: 0 })

  const [address, setAddress] = useState('')
  const [snackbarMsg, setSnackbarMsg] = useState('')
  const [provider, setProvider] = useState(null)
  const [connector, setConnector] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const handleEthTabChange = (e, newTab) => setActiveEthTab(newTab)
  const handlePolyTabChange = (e, newTab) => setActivePolyTab(newTab)
  const handleEthConnectorDialogClose = () => setEthConnectorDialog(false)
  const handleEthStakeAmountChange = ({ target }) => setEthStakeInput(target.value)
  const handlePolyStakeAmountChange = ({ target }) => setPolyStakeInput(target.value)
  const handleSnackbarOpen = msg => setSnackbarMsg(msg)
  const handleSnackbarClose = () => setSnackbarMsg('')

  const handleEthStakeMax = () => setEthStakeInput(toBaseNum(!activeEthTab ? ethLpBal : currentStakeEth))
  const handlePolyStakeMax = () => setPolyStakeInput(toBaseNum(!activePolyTab ? polyLpBal : currentStakePoly))
  useEffect(() => {
    localStorage.removeItem('walletconnect')
    handleSnackbarOpen('Connect your wallet to see your balance and perform staking actions.')
    getAprs()
  }, [])

  useEffect(() => {
    if (!provider) { return }
    getContracts()
  }, [provider])

  useEffect(() => {
    console.log(address, contracts)
    if (!contracts || !address) { return }
    getTotalRewards(address)
  }, [contracts, address])

  useEffect(() => {
    console.log(address, contracts)
    if (!ethLpBal || !polyLpBal) { return }
    getPredictedRewardRate(address)
  }, [ethLpBal, polyLpBal])

  useEffect(() => {
    if (!predictedRewardRate) { return }
    updateRewardStream()
  }, [predictedRewardRate])

  const updateRewardStream = async () => {
    setTimeout(() => {
      setPredictedRewards((prevState) => ({ prev: prevState.new,
        new: prevState.new + predictedRewardRate }))
      updateRewardStream()
    }, 1000)
  }

  const getContracts = async () => {
    try {
      if (!provider) { return }
      const web3Provider = await getWeb3InstanceOfProvider(provider)
      const polyLiquidity = new web3Provider.eth.Contract(LIQUIDITY_ABI, POLY_LIQUIDITY_REWARDS)
      const ethLiquidity = new web3Provider.eth.Contract(LIQUIDITY_ABI, ETH_LIQUIDITY_REWARDS)
      const polyLpToken = new web3Provider.eth.Contract(YUPETH_ABI, POLY_UNI_LP_TOKEN)
      const ethLpToken = new web3Provider.eth.Contract(YUPETH_ABI, ETH_UNI_LP_TOKEN)
      setContracts({ polyLpToken, ethLpToken, polyLiquidity, ethLiquidity })
    } catch (err) {
      handleSnackbarOpen('An error occured. Try again later.')
      console.log('ERR getting token contracts', err)
    }
  }

  const getTotalRewards = async (address) => {
    try {
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
      handleSnackbarOpen('An error occured. Try again later.')
      console.log('ERR getting token contracts', err)
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setConnector(null)
    setPolyRwrdAmt(null)
    setEthRwrdAmt(null)
    setCurrentStakePoly(null)
    setCurrentStakeEth(null)
    setPolyLpBal(null)
    setEthLpBal(null)
  }

  const getBalances = async (addressParam = null) => { // pass in address from child comp if function called from ConnectEth comp
    try {
      const acct = addressParam || address
      const polyBal = await contracts.polyLpToken.methods.balanceOf(acct).call({ from: acct })
      const polyStake = await contracts.polyLiquidity.methods.balanceOf(acct).call({ from: acct })
      const ethStake = await contracts.ethLiquidity.methods.balanceOf(acct).call({ from: acct })
      const ethBal = await contracts.ethLpToken.methods.balanceOf(acct).call({ from: acct })
      const polyRwrdsEarned = await contracts.polyLiquidity.methods.earned(acct).call({ from: acct })
      const ethRwrdsEarned = await contracts.ethLiquidity.methods.earned(acct).call({ from: acct })
      setPolyRwrdAmt(polyRwrdsEarned)
      setEthRwrdAmt(ethRwrdsEarned)
      setCurrentStakePoly(polyStake)
      setCurrentStakeEth(ethStake)
      setPolyLpBal(polyBal)
      setEthLpBal(ethBal)
    } catch (err) {
      incrementRetryCount()
      handleSnackbarOpen('There was a problem fetching your balances, try again.')
      console.log('ERR getting balances', err)
    }
  }
  const getPredictedRewardRate = async (address) => {
    try {
      const polyBal = await contracts.polyLpToken.methods.balanceOf(POLY_LIQUIDITY_REWARDS).call()
      const ethBal = await contracts.ethLpToken.methods.balanceOf(ETH_LIQUIDITY_REWARDS).call()
      const polyRR = await contracts.polyLiquidity.methods.rewardRate().call()
      const ethRR = await contracts.ethLiquidity.methods.rewardRate().call()
      const ethPredictedRR = toBaseNum(currentStakeEth) * toBaseNum(ethRR) / toBaseNum(ethBal)
      const polyPredictedRR = toBaseNum(currentStakePoly) * toBaseNum(polyRR) / toBaseNum(polyBal)
      setPredictedRewardRate(ethPredictedRR + polyPredictedRR)
    } catch (err) {
      incrementRetryCount()
      handleSnackbarOpen('There was a problem fetching your balances, try again.')
      console.log('ERR getting balances', err)
    }
  }

  const incrementRetryCount = () => {
    handleDisconnect()
    setRetryCount(retryCount + 1)
    if (retryCount === POLY_BACKUP_RPC_URLS.length - 1) {
      handleSnackbarOpen('Retry limit reached. Try changing the RPC URL on your wallet. We recommend Alchemy. ')
      setRetryCount(0)
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

  const getTxBody = async () => {
    const minGas = ethers.utils.parseUnits('65', 'gwei')
    const maxGas = ethers.utils.parseUnits('250', 'gwei')
    const liveGas = await (getPriceProvider()).getGasPrice()
    let gasPrice = ethers.utils.parseUnits(ethers.utils.formatUnits(liveGas.mul(3), 'gwei'), 'gwei')
    gasPrice.lte(minGas) ? gasPrice = minGas : gasPrice = maxGas
    const txBody = {
      from: address,
      gasPrice
    }
    return txBody
  }

  const handleStakingAction = async (lpToken) => {
    if (!address) {
      setEthConnectorDialog(true)
      return
    }
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
      handleSnackbarOpen('Please enter a valid amount.')
      return
    }

    try {
      const isStake = !activeEthTab
      const txBody = await getTxBody()
      const stakeAmt = (ethers.utils.parseEther(ethStakeInput.toString())).toString()
      if (isStake) {
        const approveTx = {
          ...txBody,
          to: ETH_UNI_LP_TOKEN,
          data: contracts.ethLpToken.methods.approve(ETH_LIQUIDITY_REWARDS, stakeAmt).encodeABI()
        }
        await sendTx(approveTx)
      }
      const stakeTx = {
        ...txBody,
        to: ETH_LIQUIDITY_REWARDS,
        data: isStake ? contracts.ethLiquidity.methods.stake(stakeAmt).encodeABI()
          : contracts.ethLiquidity.methods.unstake(stakeAmt).encodeABI()
      }
      await sendTx(stakeTx)
      const updatedLpBal = isStake ? toBaseNum(ethLpBal) - Number(ethStakeInput) : toBaseNum(ethLpBal) + Number(ethStakeInput)
      const updatedStake = isStake ? toBaseNum(currentStakeEth) + Number(ethStakeInput) : toBaseNum(currentStakeEth) - Number(ethStakeInput)
      setEthLpBal(toGwei(updatedLpBal)) // optimistic balance update
      setCurrentStakeEth(updatedStake * Math.pow(10, 18)) // optimistic stake update
    } catch (err) {
      if (err && err.code && err.code !== 4001) {
        handleSnackbarOpen('User rejected transaction.')// Dont logout if user rejects transaction
      } else {
        incrementRetryCount()
        handleSnackbarOpen(`We encountered a problem. ${err.message}`)
        console.log('ERR handling eth staking', err)
      }
    }
  }

  const sendTx = async (tx) => {
    const web3Provider = getWeb3InstanceOfProvider(provider)
    await Promise.race([txTimeout(2 * 60 * 1000), web3Provider.eth.sendTransaction(tx)]) // 2 min timeout
  }

  const txTimeout = (ms) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('Transaction timed out. Try again.')), ms)
    })
  }

  const handlePolyStakeAction = async () => {
    if (isInvalidStakeAmt(polyStakeInput)) {
      handleSnackbarOpen('Please enter a valid amount.')
      return
    }

    try {
      const isStake = !activePolyTab
      const txBody = await getTxBody()
      const stakeAmt = (ethers.utils.parseEther(polyStakeInput.toString())).toString()
      if (isStake) {
        const approveTx = {
          ...txBody,
          to: POLY_UNI_LP_TOKEN,
          data: contracts.polyLpToken.methods.approve(POLY_LIQUIDITY_REWARDS, stakeAmt).encodeABI()
        }
        await sendTx(approveTx)
      }
      const stakeTx = {
        ...txBody,
        to: POLY_LIQUIDITY_REWARDS,
        data: isStake ? contracts.polyLiquidity.methods.stake(stakeAmt).encodeABI()
          : contracts.polyLiquidity.methods.unstake(stakeAmt).encodeABI()
      }
      await sendTx(stakeTx)

      const updatedLpBal = isStake ? toBaseNum(polyLpBal) - Number(polyStakeInput) : toBaseNum(polyLpBal) + Number(polyStakeInput)
      const updatedStake = isStake ? toBaseNum(currentStakePoly) + Number(polyStakeInput) : toBaseNum(currentStakePoly) - Number(polyStakeInput)
      setPolyLpBal(toGwei(updatedLpBal)) // optimistic balance update
      setCurrentStakePoly(toGwei(updatedStake)) // optimistic stake update
    } catch (err) {
      if (err && err.code && err.code !== 4001) {
        handleSnackbarOpen('User rejected transaction.')
      } else {
        incrementRetryCount()
        handleSnackbarOpen(`We encountered a problem. ${err.message}`)
      }
    }
  }

  const collectRewards = async () => {
    try {
      if (!address && !connector) {
        setEthConnectorDialog(true)
        return
      }
      setIsLoading(true)
      handleSnackbarOpen('Sign the transactions to collect you rewards. There will be one transaction for each pool you are in.')
      const txBody = await getTxBody()
      if (ethRwrdAmt > 0) {
        const ethCollectTx = {
          ...txBody,
          to: ETH_LIQUIDITY_REWARDS,
          data: contracts.ethLiquidity.methods.getReward().encodeABI()
        }
        await sendTx(ethCollectTx)
        setEthRwrdAmt(0)
      }
      if (polyRwrdAmt > 0) {
        const polyCollectTx = {
          ...txBody,
          to: POLY_LIQUIDITY_REWARDS,
          data: contracts.polyLiquidity.methods.getReward().encodeABI()
        }
        await sendTx(polyCollectTx)
        setPolyRwrdAmt(0)
      }
      handleSnackbarOpen('You have succesfully collected your rewards!')
      setIsLoading(false)
    } catch (err) {
      if (err && err.code && err.code === 4001) {
        handleSnackbarOpen('User rejected transaction.')
      } else {
        incrementRetryCount()
        handleSnackbarOpen(`We encountered a problem. ${err.message}`)
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

        <Grid className={classes.page}
          container
          direction='column'
          justifyContent='center'
          alignItems='start'
          spacing={10}
        >
          <LoadingBar isLoading={isLoading} />
          <Snackbar
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            open={!!snackbarMsg}
          >
            <SnackbarContent
              message={snackbarMsg}
            />
          </Snackbar>
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
                  <Button variant='outlined'
                    href={YUP_BUY_LINK}
                    target='_blank'
                  > Buy YUP </Button>
                </Grid>
                <Grid item>
                  <Button href={`${YUP_DOCS_URL}/protocol/yup-protocol`}
                    target='_blank'
                  > Learn More </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction='row'
            justifyContent='center'
            alignItems='center'
            spacing={6}
          >
            <Grid item
              xs={12}
            >
              <Grid
                container
                direction='row'
                justifyContent='start'
                alignItems='center'
                spacing={5}
              >
                <Grid
                  container
                  item
                  xs={12}
                  md={6}
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
                              TabIndicatorProps={{ style: { background: palette.rainbowGradient } }}
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
                                        endAdornment={<Button size='xs'
                                          variant='default'
                                          onClick={handleEthStakeMax}
                                          className={classes.maxBtn}
                                        >Max</Button>}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <Button size='large'
                                      variant='contained'
                                      className={classes.submitBtn}
                                      onClick={() => handleStakingAction('eth')}
                                    >
                                      <Typography variant='body1'
                                        className={classes.submitBtnTxt}
                                      >
                                        {address ? activeEthTab ? 'Unstake' : 'Stake' : 'Connect'}
                                      </Typography>
                                    </Button>
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

                <Grid
                  container
                  item
                  xs={12}
                  md={6}
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
                              TabIndicatorProps={{ style: { background: palette.rainbowGradient } }}
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
                                        value={polyStakeInput}
                                        onChange={handlePolyStakeAmountChange}
                                        endAdornment={<Button size='xs'
                                          variant='text'
                                          onClick={handlePolyStakeMax}
                                          className={classes.maxBtn}
                                        >Max</Button>}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Grid item>
                                    <Button size='large'
                                      variant='contained'
                                      className={classes.submitBtn}
                                      onClick={() => handleStakingAction('poly')}
                                    >
                                      <Typography variant='body1'
                                        className={classes.submitBtnTxt}
                                      >
                                        {address ? activePolyTab ? 'Unstake' : 'Stake' : 'Connect'}
                                      </Typography>
                                    </Button>
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
            <Grid item>
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
                  { (!address ? true : (toBaseNum(polyRwrdAmt) + toBaseNum(ethRwrdAmt)) > 0) && (
                    <Grid item>
                      <Button size='large'
                        variant='contained'
                        className={classes.submitBtn}
                        onClick={collectRewards}
                      >
                        <Typography variant='body1'
                          className={classes.submitBtnTxt}
                        >
                          {address ? 'Collect' : 'Connect'}
                        </Typography>
                      </Button>
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
          {ethConnectorDialog && (
            <ConnectEth
              handleDisconnect={handleDisconnect}
              account={account}
              getBalances={getBalances}
              setConnector={setConnector}
              setAddress={setAddress}
              dialogOpen
              handleDialogClose={handleEthConnectorDialogClose}
              isProvider
              backupRpc={POLY_BACKUP_RPC_URLS[retryCount]}
              setProvider={setProvider}
            />)}
        </Grid>
      </Grid>
    </ErrorBoundary>
  )
}

const mapStateToProps = state => {
  const { router } = state
  const account = accountInfoSelector(state)
  return {
    feed: router.location.query.feed || state.homeFeed.feed,
    query: router.location.query,
    account
  }
}

StakingPage.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
}

export default memo(connect(mapStateToProps)(withStyles(styles)(StakingPage)))
