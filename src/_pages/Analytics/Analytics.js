import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LineChart from '../../components/Charts/LineChart'
import BarChart from '../../components/Charts/BarChart'
import DonutChart from '../../components/Charts/DonutChart'
import DotSpinner from '../../components/DotSpinner/DotSpinner'
import withStyles from '@mui/styles/withStyles'
import { Grid, Typography } from '@mui/material'
import axios from 'axios'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import { isSameDay } from 'date-fns'
import UserAvatar from '../../components/UserAvatar/UserAvatar'
import { levelColors, Brand, Other } from '../../utils/colors'
import { setCache, getCache } from '../../utils/cache'
import LinesEllipsis from 'react-lines-ellipsis/lib/loose'
import { connect } from 'react-redux'
import { accountInfoSelector } from '../../redux/selectors'
import { PageBody } from '../pageLayouts'
import { apiBaseUrl } from '../../config'

const styles = theme => ({
  accountErrorHeader: {
    paddingTop: '10vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '2vh'
  },
  accountErrorSub: {
    paddingTop: '1.5vh',
    fontFamily: '"Gilroy", sans-serif',
    fontWeight: '600',
    fontSize: '1.7vh'
  },
  avatarImage: {
    width: 88,
    height: 88,
    minHeight: 88,
    fontSize: '70px',
    borderRadius: '100%',
    border: `solid 3px ${theme.palette.M300}`,
    [theme.breakpoints.down('md')]: {
      fontSize: '50px',
      borderRadius: '100%',
      width: '70px',
      height: '70px',
      minHeight: '70px',
      minWidth: '70px'
    }
  },
  cardContainer: {
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  },
  hideOnMobile: {
    display: 'inherit',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  imgContainer: {
    margin: '0 25px'
  },
  infiniteScroll: {
    [theme.breakpoints.down('lg')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('1700')]: {
      width: '100vw'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  },
  graphContainers: {
    padding: '90px 0px 20px 0px'
  }
})

class Analytics extends Component {
  state = {
    isLoading: true,
    hasError: false,
    userEarnings: [],
    userHoldings: null,
    categoryDistribution: null,
    platformDistribution: null,
    ratingPower: 100
  }

  componentDidMount () {
    this.loadUserData()
    if (window.analytics) {
      window.analytics.page('User')
    }
  }

  getAllActions = async (voter, start, limit, type, actions) => {
    try {
      let data = (
        await axios.get(
          `https://eos.hyperion.eosrio.io/v2/history/get_actions?&filter=token.yup&account=${voter}&skip=${start}&limit=${limit}&sort=desc&${type}=${voter}`,
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        )
      ).data
      actions = actions.concat(data.actions)
      // if (actions.length >= data.total.value) return actions

      // actions = await this.getAllActions(voter, start + limit, limit, type, actions)
      return actions
    } catch (e) {
      console.log(e)
      return actions
    }
  }
  getHoldingsUser = async (account, income, outgoing) => {
    try {
      let formattedIncome = []
      let formattedOutgoing = []
      // Checking if ratelimited and missing some incoming transactions
      // If so, remove outgoing transactions that are older than the oldest income
      let oldestOutgoing = outgoing[outgoing.length - 1]
      let oldestIncome = income[income.length - 1]
      if (oldestOutgoing && oldestIncome) {
        if (
          new Date(oldestOutgoing.timestamp).getTime() <
          new Date(oldestIncome.timestamp)
        ) {
          outgoing = outgoing.filter(
            item =>
              !(new Date(item.timestamp) < new Date(oldestIncome.timestamp))
          )
        }
      }

      income.forEach((data, index) => {
        if (data.act.data.symbol === 'YUP') {
          formattedIncome[index] = {
            timestamp: new Date(data.timestamp).getTime(),
            amount: data.act.data.amount,
            type: 'incoming'
          }
        }
      })
      outgoing.forEach((data, index) => {
        if (data.act.data.symbol === 'YUP') {
          formattedOutgoing[index] = {
            timestamp: new Date(data.timestamp).getTime(),
            amount: data.act.data.amount,
            type: 'outgoing'
          }
        }
      })
      let sortedArray = formattedIncome
        .concat(formattedOutgoing)
        .sort((a, b) => b.timestamp - a.timestamp)
      let dailyData = [
        [
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
          account.balance.YUP
        ]
      ]
      sortedArray.forEach(transaction => {
        if (dailyData.length > 0) {
          if (
            isSameDay(
              new Date(transaction.timestamp),
              dailyData[dailyData.length - 1][0]
            )
          ) {
            dailyData[dailyData.length - 1][1] =
              transaction.type === 'incoming'
                ? +(
                  dailyData[dailyData.length - 1][1] - transaction.amount
                ).toFixed(4)
                : +(
                  dailyData[dailyData.length - 1][1] + transaction.amount
                ).toFixed(4)
          } else {
            dailyData.push([
              new Date(
                new Date(transaction.timestamp).getFullYear(),
                new Date(transaction.timestamp).getMonth(),
                new Date(transaction.timestamp).getDate()
              ),
              transaction.type === 'incoming'
                ? +(
                  dailyData[dailyData.length - 1][1] - transaction.amount
                ).toFixed(4)
                : +(
                  dailyData[dailyData.length - 1][1] + transaction.amount
                ).toFixed(4)
            ])
          }
        }
      })
      this.setState({ isLoading: false, userHoldings: dailyData })
    } catch (err) {
      console.log(err)
    }
  }

  getEarningsUser = async (account, income) => {
    try {
      let sortedArray = []
      income.forEach(payment => {
        if (payment.act.data.symbol === 'YUP') {
          sortedArray.push([
            new Date(payment.timestamp).getTime(),
            payment.act.data.amount
          ])
        }
      })
      sortedArray = sortedArray.sort((a, b) => b[0] - a[0])
      let dailyData = [
        [
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          ),
          account.total_claimed_rewards
        ]
      ]
      sortedArray.forEach(transaction => {
        if (dailyData.length > 0) {
          if (
            isSameDay(
              new Date(transaction[0]),
              dailyData[dailyData.length - 1][0]
            )
          ) {
            dailyData[dailyData.length - 1][1] =
              dailyData[dailyData.length - 1][1] - transaction[1]
          } else {
            dailyData.push([
              new Date(
                new Date(transaction[0]).getFullYear(),
                new Date(transaction[0]).getMonth(),
                new Date(transaction[0]).getDate()
              ),
              dailyData[dailyData.length - 1][1] - transaction[1]
            ])
          }
        }
      })
      dailyData = this.cleanupData(dailyData)
      this.setState({ isLoading: false, userEarnings: dailyData })
    } catch (e) {
      console.log(e)
    }
  }
  // Current data we get through eos api seems to be off by a bit.
  // Until we have our own analytics we need to set the values to 0 if the earnings/holdings have negative values
  // Breaks the chart styling otherwise ( and confuses the users)
  cleanupData = data => {
    data.forEach(entry => {
      if (entry[1] < 0) entry[1] = 0
    })
    return data
  }
  getDistributions = async account => {
    try {
      const data = (
        await axios.get(`${apiBaseUrl}/analytics/distribution/${account}`)
      ).data

      let valuesCat = Object.values(data.categoryDistribution)
        .sort((a, b) => b - a)
        .slice(0, 5)
      let keysCat = Object.keys(data.categoryDistribution)
        .sort(
          (a, b) => data.categoryDistribution[b] - data.categoryDistribution[a]
        )
        .slice(0, 5)
      let resultCat = []
      let i = -1
      let valuesPlat = Object.values(data.platformDistribution)
        .sort((a, b) => b - a)
        .slice(0, 5)
      let keysPlat = Object.keys(data.platformDistribution)
        .sort(
          (a, b) => data.platformDistribution[b] - data.platformDistribution[a]
        )
        .slice(0, 5)
      let resultPlat = []
      let k = -1
      while (valuesCat[++i]) {
        resultCat.push([keysCat[i], valuesCat[i]])
      }
      while (valuesPlat[++k]) {
        resultPlat.push([keysPlat[k], valuesPlat[k]])
      }
      const entriesCat = new Map(resultCat)
      const entriesPlat = new Map(resultPlat)
      const objCat = Object.fromEntries(entriesCat)

      const objPlat = Object.fromEntries(entriesPlat)
      this.setState({
        isLoading: false,
        categoryDistribution: objCat,
        platformDistribution: objPlat
      })
    } catch (e) {
      console.log(e)
    }
  }

  ratingPower = async () => {
    const { account } = this.state
    const MIN_VOTE_LIMIT = 20
    const MID_VOTE_LIMIT = 30
    const MAX_VOTE_LIMIT = 40
    let yupBal = account && account.balance.YUP
    let maxVoteCount =
      yupBal > 100
        ? MAX_VOTE_LIMIT
        : yupBal < 0.5
          ? MIN_VOTE_LIMIT
          : MID_VOTE_LIMIT
    let voteCount = 0
    const actionUsage = (
      await axios.get(
        `${apiBaseUrl}/accounts/actionusage/${account && account._id}`
      )
    ).data
    const now = new Date().getTime()
    const oneDayInMs = 60 * 60 * 24 * 1000
    if (actionUsage.lastReset + oneDayInMs >= now) {
      voteCount = actionUsage.createVoteCount
    }

    if (maxVoteCount < voteCount) {
      return 0
    }
    this.setState({
      isLoading: false,
      ratingPower: Math.round(((maxVoteCount - voteCount) / maxVoteCount) * 100)
    })
  }
  loadUserData = () => {
    ;(async () => {
      try {
        const { pathname } = window.location
        const username = pathname.split('/')[1]

        const account = (
          await axios.get(`${apiBaseUrl}/levels/user/${username}`)
        ).data
        this.setState({ isLoading: false, account: account })
        this.ratingPower()
        this.getDistributions(account._id)
        let income = await getCache('income:' + account._id, 24 * 60 * 60000)
        let outgoing = await getCache(
          'outgoing:' + account._id,
          24 * 60 * 60000
        )

        if (!outgoing || !outgoing.length) {
          outgoing = await this.getAllActions(
            account._id,
            0,
            1000,
            'transfer.from',
            []
          )
          setCache('outgoing:' + account._id, outgoing)
        }
        if (!income || !income.length) {
          income = await this.getAllActions(
            account._id,
            0,
            1000,
            'transfer.to',
            []
          )
          setCache('income:' + account._id, income)
        }
        this.setState({ totalClaimedRewards: account.total_claimed_rewards })

        this.getEarningsUser(account, income)
        this.getHoldingsUser(account, income, outgoing)
      } catch (err) {
        this.setState({ hasError: true, isLoading: false })
      }
    })()
  }

  render () {
    const { classes } = this.props
    const {
      account,
      totalClaimedRewards,
      isLoading,
      hasError,
      userEarnings,
      userHoldings,
      categoryDistribution,
      platformDistribution,
      ratingPower
    } = this.state

    const influence = account && account.weight
    const quantile = account && account.quantile
    const socialLevelColor = levelColors[quantile]
    const isMirror =
      account && account.twitterInfo && account.twitterInfo.isMirror
    if (!isLoading && hasError) {
      return (
        <ErrorBoundary>
          <PageBody>
            <div align='center'>
              <Typography className={classes.accountErrorHeader}
                variant='h1'
              >
                <strong>Sorry this page is not available.</strong>
              </Typography>
              <Typography className={classes.accountErrorSub}
                variant='h2'
              >
                The page you're looking for does not exist.
              </Typography>
            </div>
          </PageBody>
        </ErrorBoundary>
      )
    } else if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <DotSpinner />
        </div>
      )
    }

    return (
      <ErrorBoundary>
        <PageBody>
          <Grid
            container
            direction='row'
            alignItems='center'
            justifyContent='left'
            className={classes.graphContainers}
            spacing={3}
          >
            <Grid item>
              <UserAvatar
                alt={account._id}
                username={account.username}
                className={classes.avatarImage}
                src={account.avatar}
                style={{ border: `solid 3px ${socialLevelColor}` }}
              />
            </Grid>
            <Grid item>
              <Typography align='left'
                variant='h2'
              >
                <LinesEllipsis
                  maxLine='4'
                  text={account.fullname || account.username || account._id}
                />
              </Typography>
              <Typography
                align='left'
                variant='subtitle2'
                className={`${classes.username}`}
              >
                <span
                  style={{
                    textDecoration: socialLevelColor ? 'none' : 'none',
                    textDecorationColor: socialLevelColor,
                    textDecorationStyle: socialLevelColor ? 'solid' : 'none',
                    fontWeight: isMirror ? '200' : '200',
                    padding: 0
                  }}
                >
                  @{account.username}
                </span>
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            direction='row'
            alignItems='center'
            justifyContent='center'
            spacing={3}
          >
            <Grid item
              sm={6}
              xs={12}
            >
              <BarChart
                chartData={influence}
                chartTitle='Influence'
                color={socialLevelColor}
              />
            </Grid>
            <Grid item
              sm={6}
              xs={12}
            >
              <BarChart
                chartData={ratingPower}
                chartTitle='Rating Power'
                color=''
              />
            </Grid>
            <Grid item
              sm={6}
              xs={12}
            >
              <LineChart
                headerNumber={totalClaimedRewards}
                chartData={{ name: 'Earnings', data: userEarnings }}
                chartTitle='Earnings'
              />
            </Grid>
            <Grid item
              sm={6}
              xs={12}
            >
              <LineChart
                headerNumber={account.balance.YUP}
                chartData={{ name: 'Holdings', data: userHoldings }}
                chartTitle='Holdings'
              />
            </Grid>
            <Grid item
              xs={12}
            >
              <Grid
                container
                direction='row'
                spacing={3}
                alignItems='stretch'
              >
                <Grid item
                  xs={12}
                  sm={6}
                >
                  <DonutChart
                    chartData={platformDistribution}
                    colors={[
                      Other.blue,
                      Brand.red,
                      Brand.orange,
                      Brand.mint
                    ]}
                    className={classes}
                    chartTitle='Platform Distribution'
                  />
                </Grid>
                <Grid item
                  xs={12}
                  sm={6}
                >
                  <DonutChart
                    chartData={categoryDistribution}
                    className={classes}
                    chartTitle='Categories Distribution'
                    colors={[
                      Other.blue,
                      Brand.red,
                      Brand.orange,
                      Brand.mint
                    ]}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </PageBody>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)

  return {
    account,
    push: state.scatterInstallation.push
  }
}

Analytics.propTypes = {
  classes: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(Analytics))
