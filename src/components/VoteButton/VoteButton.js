import React, { Component, memo } from 'react'
import { isEmpty } from 'lodash'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'
import { Grid, Grow, Typography, Portal, Tooltip, SvgIcon, Snackbar, Icon } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import withStyles from '@mui/styles/withStyles'
import withTheme from '@mui/styles/withTheme'
import SnackbarContent from '@mui/material/SnackbarContent'
import polly from 'polly-js'
import numeral from 'numeral'
import axios from 'axios'
import { parseError } from '../../eos/error'
import { connect } from 'react-redux'
import { setPostInfo, updateInitialVote, updateVoteLoading } from '../../redux/actions'
import { levelColors } from '../../utils/colors'
import Rating from '@mui/material/Rating'
import equal from 'fast-deep-equal'
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog'
import scatter from '../../eos/scatter/scatter.wallet'
import rollbar from '../../utils/rollbar'
import isEqual from 'lodash/isEqual'
import { accountInfoSelector, ethAuthSelector } from '../../redux/selectors'
import { deletevote, editvote, createvotev4, postvotev4, postvotev3, createvote } from '../../eos/actions/vote'
import AuthModal from '../../features/AuthModal'
import { YupButton } from '../Miscellaneous'

const { BACKEND_API } = process.env
const CREATE_VOTE_LIMIT = 20

const CAT_ICONS = {
  popularity: 'up',
  intelligence: 'down'
}

const CAT_DESC = {
  easy:
    'Easy: can do well without extra effort; generous grading, minimal time',
  interesting: 'Interesting: compelling subject matter, makes you think',
  useful: 'Useful: has important knowledge for your field/career',
  knowledgeable:
    "Knowledgeable: knows what they're talking about, expert in subject",
  engaging:
    'Engaging: captures your attention, makes concepts easy to understand',
  chill: 'Chill: cool, laidback, a vibe',
  popularity: 'like',
  intelligence: 'smart',
  trustworthy: 'most trustworthy',
  wouldelect: 'most electable',
  agreewith: 'most agreed with',
  fire: 'Fire: really good, amazing'
}

const DEFAULT_WAIT_AND_RETRY = [
  250,
  250,
  250,
  250,
  250,
  300,
  350,
  400,
  400,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500,
  500
]

const styles = (theme) => ({
  greenArrow: {
    color: levelColors.second
  },
  redArrow: {
    color: levelColors.sixth
  },
  defaultArrow: {
    color: 'white',
    opacity: 0.6
  },
  catIcon: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    padding: '2px',
    [theme.breakpoints.down('md')]: {
      height: 25,
      width: 25,
      margin: 0
    }
  },
  postWeight: {
    fontSize: '16px',
    [theme.breakpoints.down('md')]: {
      fontSize: '20px'
    }
  },
  snackbar: {
    position: 'absolute',
    backgroundColor: '#ff5252',
    textColor: '#f0f0f0',
    width: '8%'
  },
  snack: {
    backgroundColor: '#ff5252',
    color: '#fff8f3',
    fontWeight: 'light'
  },
  snackbarContent: {
    width: 150
  },
  snackUpper: {
    backgroundColor: 'transparent',
    paddingBottom: 0
  },
  dialog: {
    width: '100%',
    marginLeft: 190,
    [theme.breakpoints.down('xl')]: {
      marginLeft: 0,
      width: '100%'
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 190,
      width: `calc(100% - 190px)`
    },
    [theme.breakpoints.up('1600')]: {
      width: '100%',
      marginLeft: 0
    }
  },
  mobileBtn: {
    [theme.breakpoints.down('lg')]: {
      width: '1.2em'
    }
  }
})

const ratingStyles = ({ palette }) => ({
  iconFilled: {
    border: '3px',
    borderColor: palette.M100,
    color: palette.M900
  },
  iconHover: {
    stroke: palette.M100
  },
  iconEmpty: {
    color: palette.M900
  }
})
const StyledRating = withStyles(ratingStyles)(Rating)

const labels = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5'
}

const ratingConversion = {
  1: 2,
  2: 1,
  3: 1,
  4: 2,
  5: 3
}

const quantileToRating = {
  first: 5,
  second: 4,
  third: 3,
  fourth: 2,
  fifth: 1
}

const ratingToQuantile = {
  5: 'first',
  4: 'second',
  3: 'third',
  2: 'fourth',
  1: 'fifth'
}

const dislikeRatingConversion = {
  1: 2,
  2: 1
}

const likeRatingConversion = {
  1: 3,
  2: 4,
  3: 5
}

const convertRating = (like, rating) =>
  like ? likeRatingConversion[rating] : dislikeRatingConversion[rating]

const IconWithRef = React.forwardRef(function IconWithRef (props, ref) {
  const { value, handleRatingChange } = props

  return (
    <div
      ref={ref} // Refs and props for tooltip + vote mouse events
      onTouchStart={(e) => {
        handleRatingChange(e, value)
      }}
      onClick={(e) => {
        handleRatingChange(e, value)
      }}
    >
      <div {...props} />
    </div>
  )
})

IconWithRef.propTypes = {
  handleRatingChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired
}

const IconContainer = memo((props) => {
  const { value, ratingAvg, quantile, vote, handleRatingChange, hoverValue } = props
  const { palette } = useTheme()
  const quantileColor = levelColors[quantile]
  const convertedVoterRating = vote
    ? convertRating(vote.like, vote.rating)
    : null

  const ratingQuantile = quantileToRating[quantile]
  const ratingQuantileStyle = (ratingQuantile >= value) ? { color: quantileColor } : { color: palette.M700 }
  const voteStyle = (convertedVoterRating >= value) ? { stroke: palette.M300 } : {}
  const marginStyle = (window.innerWidth <= 440)
    ? { marginTop: '-3px', marginRight: '-5px', marginLeft: '-6px' }
    : { marginTop: '-3px', marginRight: '-9px', marginLeft: '-1.5px' }

  const defaultQuantileColor = levelColors[ratingToQuantile[hoverValue]]
  const hoverStyle = (defaultQuantileColor && hoverValue && hoverValue) >= value
    ? { color: defaultQuantileColor }
    : {}

  const style = {
    ...marginStyle,
    ...ratingQuantileStyle,
    ...voteStyle,
    ...hoverStyle // will override the ratingQuantileStyle if defined
  }

  return (
    <StyledTooltip title={labels[value] || ''}
      enterDelay={1500}
    >
      <IconWithRef
        {...props}
        value={value}
        ratingAvg={ratingAvg}
        quantile={quantile}
        handleRatingChange={handleRatingChange}
        style={style}
      />
    </StyledTooltip>
  )
})

const StyledTooltip = memo(
  withStyles({
    popper: {
      marginTop: '-10px',
      marginLeft: '14px'
    }
  })((props) => (
    <Tooltip
      {...props}
      disableTouchListener
      classes={{
        popper: props.classes.popper
      }}
    />
  ))
)

StyledTooltip.propTypes = {
  classes: PropTypes.object.isRequired
}

IconContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  handleRatingChange: PropTypes.func.isRequired,
  ratingAvg: PropTypes.number.isRequired,
  hoverValue: PropTypes.number.isRequired,
  quantile: PropTypes.string.isRequired,
  vote: PropTypes.object
}

const VoteLoader = (props) => (
  <CircularProgress size={30}
    style={{ marginRight: '5px', color: 'white' }}
  />
)

class CatIcon extends Component {
  state = {
    category: this.props.category,
    voteLoading: this.props.voteLoading
  }

  componentDidUpdate (prevProps) {
    const { quantile, category, voteLoading } = this.props
    const {
      quantile: prevQuantile,
      category: prevCategory,
      voteLoading: prevVoteLoading
    } = prevProps
    if (
      !equal(
        {
          quantile,
          category,
          voteLoading
        },
        {
          quantile: prevQuantile,
          category: prevCategory,
          voteLoading: prevVoteLoading
        }
      )
    ) {
      this.updateIconInfo({
        quantile,
        category,
        voteLoading
      })
    }
  }

  updateIconInfo ({ quantile, category, voteLoading }) {
    this.setState({ category, voteLoading })
  }

  render () {
    const { category, voteLoading } = this.state
    const { classes, handleDefaultVote } = this.props

    if (voteLoading) {
      return <VoteLoader />
    }

    return (
      <Icon
        placeholder2={classes.catIcon}
        onClick={handleDefaultVote}
        placeholder={CAT_ICONS[category]}
        fontSize='small'
        className={`fa${(this.state.currRating > 0) ? `s` : `l`} fa-thumbs-${CAT_ICONS[category]}`}
        style={{ fontSize: window.innerWidth <= 600 ? '16px' : 'inherit' }}
      />
    )
  }
}

CatIcon.propTypes = {
  quantile: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  handleDefaultVote: PropTypes.func.isRequired,
  voteLoading: PropTypes.bool.isRequired
}

const StyledCatIcon = withStyles({
  catIcon: {
    width: 35,
    height: 35,
    margin: 0,
    marginTop: 0,
    cursor: 'pointer'
  }
})(CatIcon)

class PostStats extends Component {
  state = {
    weight: this.props.weight,
    totalVoters: this.props.totalVoters
  };

  componentDidUpdate (prevProps) {
    const { weight, totalVoters } = this.props
    const { weight: prevWeight, totalVoters: prevTotalVoters } = prevProps
    if (
      !equal(
        {
          weight,
          totalVoters
        },
        {
          weight: prevWeight,
          totalVoters: prevTotalVoters
        }
      )
    ) {
      this.updatePostStats({
        weight,
        totalVoters
      })
    }
  }

  updatePostStats ({ weight, totalVoters }) {
    this.setState({ weight, totalVoters })
  }

  render () {
    const { classes, isShown, quantile, theme } = this.props
    const { totalVoters, weight } = this.state
    return (
      <Grid itemRef=''>
        <Grid container
          spacing={0}
        >
          <Grid item>
            <Typography variant='body2'
              className={classes.weight}
              style={{ color: !isShown ? levelColors[quantile] : theme.palette.M200 }}
              placeholder={weight}
            >{Math.round(totalVoters ** (1 + 0.001 * weight)) /* this is a temporary calculation to be expanded on */}</Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

PostStats.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  totalVoters: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  isShown: PropTypes.bool.isRequired,
  quantile: PropTypes.string.isRequired
}

const postStatStyles = theme => ({
  weight: {
    marginRight: '3px',
    fontSize: '16px'
  },
  totalVoters: {
    fontSize: '16px',
    color: theme.palette.M300,
    opacity: 0.3,
    marginLeft: '7px'
  }
})

const StyledPostStats = withTheme(withStyles(postStatStyles)(PostStats))

// TODO: Convert to functional component
class VoteButton extends Component {
  state = {
    voteLoading: false,
    currWeight: this.props.catWeight || 0,
    hoverValue: 0,
    currRating: this.props.currRating,
    currTotalVoters: this.calcTotalVoters(),
    currPostCatQuantile: this.getPostCatQuantile()
  };

  componentDidUpdate (prevProps) {
    const updatedPostCatQuantile = this.getPostCatQuantile()
    if (this.state.currPostCatQuantile !== updatedPostCatQuantile) {
      this.updatePostCatQuantile(updatedPostCatQuantile)
    }
  }

  updatePostCatQuantile (updatedPostCatQuantile) {
    this.setState({ currPostCatQuantile: updatedPostCatQuantile })
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  async fetchUpdatedPostInfo () {
    try {
      return polly()
        .waitAndRetry(DEFAULT_WAIT_AND_RETRY)
        .executeForPromise(() => {
          return new Promise(async (resolve, reject) => {
            try {
              const { postid, dispatch, listType, category } = this.props
              const listQuery = listType ? `?list=${listType}` : ''

              const postData = (
                await axios.get(
                  `${BACKEND_API}/posts/post/${postid}${listQuery}`
                )
              ).data
              const quantile = postData.quantiles[category]

              const prevWeight = this.state.currWeight
              const currWeight = postData.weights[category] || 0

              if (prevWeight === currWeight) {
                throw new Error('Vote or post has not been found')
              }

              await dispatch(setPostInfo(postid, postData))
              this.updatePostCatQuantile(quantile)
              this.setState({ currWeight })
              resolve(postData)
            } catch (error) {
              reject(error)
            }
          })
        })
    } catch (error) {
      console.error('Failed to fetch quantiles', error)
    }
  }

  async fetchInitialVote () {
    const { postid, account, category, dispatch } = this.props
    if (account == null) {
      return
    }

    await polly()
      .waitAndRetry([
        250,
        250,
        250,
        250,
        250,
        300,
        350,
        400,
        400,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500,
        500
      ])
      .executeForPromise(() => {
        return new Promise(async (resolve, reject) => {
          const data = (
            await axios.get(
              `${BACKEND_API}/votes/post/${postid}/voter/${account.name}`
            )
          ).data
          for (let vote of data) {
            if (vote && vote.like === this.state.like && vote.category === category) {
              reject(
                Error('Fetched pre-existing vote instead of updated vote')
              )
              return
            }
            dispatch(updateInitialVote(postid, account.name, category, vote))
            resolve(vote)
            return
          }
          reject(Error('Vote not found'))
        })
      })
  }

  handleSnackbarOpen = (msg) => {
    this.setState({ snackbarOpen: true, snackbarContent: msg })
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarContent: '' })
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true })
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false })
  };

  formatWeight = (weight) => {
    const _weight = Math.round(weight)
    if (weight < 1000) {
      return numeral(_weight).format('0a')
    } else if (weight < 10000) {
      return numeral(_weight).format('0.00a')
    } else {
      return numeral(_weight).format('0.0a')
    }
  };

  deletevvote = async (voteid) => {
    const { signature } = await scatter.scatter.getAuthToken()
    await axios.delete(`${BACKEND_API}/votes/${voteid}`, { data: { signature } })
  }

  handleDefaultVote = async () => {
    const { currRating } = this.state
    const defaultRating = 3
    const prevRating = currRating || this.props.currRating
    await this.handleVote(prevRating, defaultRating)
  };

  submitVote = async (prevRating, newRating, ignoreLoading) => {
    const { account, postid, postInfo, category, vote, dispatch, ethAuth } = this.props
    const { post } = postInfo
    const { caption, imgHash, videoHash, tag } = post

    const { currTotalVoters } = this.state

    if (account == null) {
      this.handleDialogOpen()
      return
    }

    const signedInWithEth = !scatter.connected && !!ethAuth
    const signedInWithTwitter = !scatter.connected && !!localStorage.getItem('twitterMirrorInfo')

    // Converts 1-5 rating to like/dislike range
    const rating = ratingConversion[newRating]
    const like = newRating > 2
    const oldRating = ratingConversion[prevRating]

    this.setState({ voteLoading: true })
    dispatch(updateVoteLoading(postid, account.name, category, true))
    let stateUpdate = {}
    if (vote == null || vote._id == null) {
      if (post.onchain === false) {
        if (signedInWithEth) {
          await postvotev3(account, { postid, caption, imgHash, videoHash, tag, like, category, rating }, ethAuth)
        } else if (signedInWithTwitter) {
          await postvotev3(account, { postid, caption, imgHash, videoHash, tag, like, category, rating })
        } else {
          await scatter.scatter.postvotev3({ data: { postid, caption, imgHash, videoHash, tag, like, category, rating } })
        }
      } else {
        if (signedInWithEth) {
          await createvote(account, { postid, like, category, rating }, ethAuth)
        } else if (signedInWithTwitter) {
          await createvote(account, { postid, like, category, rating })
        } else {
          const txStatus = await scatter.scatter.createVote({ data: { postid, like, category, rating } })
          if (txStatus === 'Action limit exceeded for create vote') {
            this.handleSnackbarOpen("You've run out of votes for the day")
            this.setState({ voteLoading: false })
            dispatch(updateVoteLoading(postid, account.name, category, false))
            return
          }
        }
      }
      await this.fetchInitialVote()
      stateUpdate = { currTotalVoters: currTotalVoters + 1 }
    } else if (vote && prevRating === newRating) {
      if (vote.onchain === false && !signedInWithEth && !signedInWithTwitter) {
        await this.deletevvote(vote._id.voteid)
        dispatch(updateInitialVote(postid, account.name, category, null))
        stateUpdate = { currTotalVoters: currTotalVoters - 1 }
      } else {
        if (signedInWithEth) {
          await deletevote(account, { voteid: vote._id.voteid }, ethAuth)
        } else if (signedInWithTwitter) {
          await deletevote(account, { voteid: vote._id.voteid })
        } else {
          await scatter.scatter.deleteVote({ data: { voteid: vote._id.voteid } })
        }
        dispatch(updateInitialVote(postid, account.name, category, null))
        stateUpdate = { currTotalVoters: currTotalVoters - 1 }
      }
    } else {
      let voteid = vote._id.voteid
      if (post.onchain === false) {
        if (vote.onchain === false) {
          if (signedInWithEth) {
            await postvotev4(account, { postid, voteid, caption, imgHash, videoHash, tag, like, category, rating }, ethAuth)
          } else if (signedInWithTwitter) {
            await postvotev4(account, { postid, voteid, caption, imgHash, videoHash, tag, like, category, rating })
          } else {
            await scatter.scatter.postvotev4({ data: { postid, voteid, caption, imgHash, videoHash, tag, like, category, rating } })
          }
        } else {
          if (signedInWithEth) {
            await postvotev3(account, { postid, caption, imgHash, videoHash, tag, like, category, rating }, ethAuth)
          } else if (signedInWithTwitter) {
            await postvotev3(account, { postid, caption, imgHash, videoHash, tag, like, category, rating })
          } else {
            await scatter.scatter.postvotev3({ data: { postid, caption, imgHash, videoHash, tag, like, category, rating } })
          }
        }
      } else {
        if (vote.onchain === false) {
          if (signedInWithEth) {
            await createvotev4(account, { postid, voteid, like, category, rating }, ethAuth)
          } else if (signedInWithTwitter) {
            await createvotev4(account, { postid, voteid, like, category, rating })
          } else {
            await scatter.scatter.createvotev4({ data: { postid, voteid, like, category, rating } })
          }
        } else {
          if (signedInWithEth) {
            await editvote(account, { voteid: vote._id.voteid, like, rating, category }, ethAuth)
          } else if (signedInWithTwitter) {
            await editvote(account, { voteid: vote._id.voteid, like, rating, category })
          } else {
            await scatter.scatter.editVote({ data: { voteid: vote._id.voteid, like, rating, category } })
          }
        }
      }

      const voteInfluence = Math.round(vote.influence)
      const updatedVoteInfluence = Math.round((rating / oldRating) * voteInfluence)

      const newVote = {
        ...vote,
        like,
        rating,
        influence: updatedVoteInfluence
      }
      dispatch(updateInitialVote(postid, account.name, category, newVote))
    }

    this.fetchUpdatedPostInfo()
    this.setState({ ...stateUpdate, voteLoading: false })
    dispatch(updateVoteLoading(postid, account.name, category, false))
  }

  submitForcedVote = async (prevRating, newRating) => {
    const { account, postid, category, dispatch } = this.props
    try {
      const actionUsage = await this.fetchActionUsage(account.name)
      const lastReset = new Date(actionUsage.lastReset).getTime()
      const dayInMs = 24 * 60 * 60 * 1000
      const now = new Date().getTime()

      // Check if there are votes remaining for current period
      if (
        actionUsage == null ||
        now >= lastReset + dayInMs ||
        CREATE_VOTE_LIMIT > actionUsage.createVoteCount
      ) {
        let forcedVoteRating
        const highestLike = 3
        const highestDislike = 2
        const remainingVotes = CREATE_VOTE_LIMIT - actionUsage.createVoteCount
        let highestPossibleRating
        if (newRating > 2) {
          highestPossibleRating = Math.min(
            Math.floor(Math.sqrt(remainingVotes)),
            highestLike
          )
          // TODO: Throw if the remaining votes is 0
          forcedVoteRating = likeRatingConversion[highestPossibleRating]
        } else {
          highestPossibleRating = Math.min(
            Math.floor(Math.sqrt(remainingVotes)),
            highestDislike
          )
          forcedVoteRating = dislikeRatingConversion[highestPossibleRating]
        }
        await this.submitVote(prevRating, forcedVoteRating, true)
        return
      }
      this.handleSnackbarOpen("You've run out of votes for the day")
      this.setState({ voteLoading: false })
      dispatch(updateVoteLoading(postid, account.name, category, false))
    } catch (error) {
      this.handleSnackbarOpen(parseError(error, 'vote'))
      this.setState({ voteLoading: false })
      dispatch(updateVoteLoading(postid, account.name, category, false))
    }
  }

  handleVote = async (prevRating, newRating) => {
    const { account, postid, category, dispatch } = this.props
    try {
      if (account == null) {
        this.handleDialogOpen()
        return
      }

      await this.submitVote(prevRating, newRating)
    } catch (error) {
      const actionLimitExc = /Action limit exceeded/gm
      const jsonStr = typeof error === 'string' ? error : JSON.stringify(error)

      // Submit forced vote if action limit will be exceeded
      if (jsonStr.match(actionLimitExc)) {
        await this.submitForcedVote(prevRating, newRating)
        return
      }
      this.handleSnackbarOpen(parseError(error, 'vote'))
      this.setState({ voteLoading: false })
      dispatch(updateVoteLoading(postid, account.name, category, false))
      rollbar.error(
        'WEB APP VoteButton handleVote() ' +
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2) +
          ':\n' +
          'Post ID: ' +
          postid +
          ', Account: ' +
          account.name +
          ', Category: ' +
          category
      )
      console.error(
        'WEB APP VoteButton handleVote() ' +
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2) +
          ':\n' +
          'Post ID: ' +
          postid +
          ', Account: ' +
          account.name +
          ', Category: ' +
          category
      )
    }
  }

  calcTotalVoters () {
    const { postInfo, category } = this.props
    const { post } = postInfo
    if (post == null) {
      return 0
    }
    const catUpvotes = (post.catVotes[category] && post.catVotes[category].up)
      ? post.catVotes[category].up
      : 0
    const catDownvotes = (post.catVotes[category] && post.catVotes[category].down)
      ? post.catVotes[category].down
      : 0
    const totalVoters = catUpvotes + catDownvotes

    return totalVoters
  }

  getPostCatQuantile () {
    const { postInfo, category } = this.props
    const { post } = postInfo
    const ups = (post.catVotes[category] && post.catVotes[category].up) || 0
    const downs = (post.catVotes[category] && post.catVotes[category].down) || 0
    const totalVotes = ups + downs
    if (
      totalVotes === 0 ||
      post == null ||
      post.quantiles == null ||
      post.quantiles[category] == null
    ) {
      return 'none'
    }

    return post.quantiles[category]
  }

  onChangeActive = (e, value) => {
    this.setState({ hoverValue: value })
  }

  fetchActionUsage = async (eosname) => {
    try {
      const resData = (await axios.get(`${BACKEND_API}/accounts/actionusage/${eosname}`)).data
      return resData
    } catch (err) {
      console.error('Failed to fetch action usage', err)
    }
  }

  otherVotesLoading = () => {
    const { votesForPost } = this.props
    if (isEmpty(votesForPost)) { return }
    const voteKeys = Object.keys(votesForPost.votes)
    for (let cat of voteKeys) {
      const vote = votesForPost.votes[cat]
      if (vote && vote.isLoading) return true
    }
    return false
  }

  handleRatingChange = async (e, newRating) => {
    e.preventDefault()
    const { currRating } = this.state
    const prevRating = currRating || this.props.currRating
    await this.handleVote(prevRating, newRating)
    this.setState({ currRating: newRating })
  }

  render () {
    const { classes, category, postInfo, isShown } = this.props
    const { currWeight, currTotalVoters, voteLoading, hoverValue } = this.state
    let currPostCatQuantile = this.state.currPostCatQuantile
    const { post } = postInfo

    const ups = (post.catVotes[category] && post.catVotes[category].up) || 0
    const downs = (post.catVotes[category] && post.catVotes[category].down) || 0
    const totalVotes = ups + downs
    const formattedWeight = totalVotes === 0 ? 0 : this.formatWeight(currWeight)

    const ratingAvg =
      post.rating && post.rating[category]
        ? post.rating[category].ratingAvg
        : 0

    const cachedTwitterMirrorInfo = localStorage.getItem('twitterMirrorInfo')
    const twitterInfo = cachedTwitterMirrorInfo && JSON.parse(cachedTwitterMirrorInfo)

    return <>
      <Tooltip title='Weighted Like Count'
        disableTouchListener
      >
        <YupButton size='small'
          variant='ghost'
          color='secondary'
          style={{ width: 'fit-content' }}
          onClick=''
          aria-label='like'
          startIcon={<Icon
            fontSize='small'
            className={`fa${(this.state.currRating > 0) ? `s` : `l`} fa-thumbs-${CAT_ICONS[category]}`}
          />}
        >
          <Grid
            alignItems='center'
            container
            direction='row'
            justifyContent='flex-start'
            wrap='nowrap'
            spacing={1}
          >
            <Grid item
              style={{ zIndex: 100, display: 'none' }}
            >
              <Tooltip title={CAT_DESC[category] || category}>
                <Grid
                  alignItems='center'
                  container
                  direction='column'
                  justifyContent='space-around'
                >
                  <Grid item
                    style={{ height: '1em' }}>
                    <StyledCatIcon
                      category={category}
                      handleDefaultVote={this.handleDefaultVote}
                      voteLoading={voteLoading}
                      quantile={currPostCatQuantile}
                    />
                  </Grid>
                </Grid>
              </Tooltip>
            </Grid>
            <Grid
              className={classes.postWeight}
              item
            >
              <StyledPostStats
                totalVoters={currTotalVoters}
                weight={formattedWeight}
                isShown={isShown}
              />
              <Grid item
                style={{ display: 'none' }}>
                {!isShown && (
                  <Grow in
                    timeout={300}
                  >
                    <StyledRating
                      emptyIcon={null}
                      name='customized-color'
                      max={5}
                      precision={1}
                      onChangeActive={this.onChangeActive}
                      IconContainerComponent={(props) => (
                        <IconContainer
                          {...props}
                          quantile={currPostCatQuantile}
                          ratingAvg={ratingAvg}
                          handleRatingChange={this.handleRatingChange}
                          hoverValue={hoverValue}
                          vote={this.props.vote}
                          currRating={
                            this.state.currRating || this.props.currRating
                          }
                        />
                      )}
                      icon={
                        window.matchMedia('(max-width: 520px)') ? (
                          <SvgIcon className={classes.mobileBtn}>
                            <circle cy='12'
                              cx='12'
                              r='4'
                              strokeWidth='1'
                            />{' '}
                          </SvgIcon>
                        ) : (
                          <SvgIcon>
                            <circle cy='12'
                              cx='12'
                              r='5'
                              strokeWidth='2'
                            />{' '}
                          </SvgIcon>
                        )
                      }
                    />
                  </Grow>
                )}
              </Grid>
            </Grid>
          </Grid>
        </YupButton>
      </Tooltip>
      <Portal>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={4000}
          className={classes.snackUpper}
          onClose={this.handleSnackbarClose}
          open={this.state.snackbarOpen}
        >
          <SnackbarContent
            className={classes.snack}
            message={this.state.snackbarContent}
          />
        </Snackbar>
      </Portal>
      {/* TODO: Use `useAuthModal` after converting to functional component. */}
      {twitterInfo ? (
        <WelcomeDialog
          dialogOpen={this.state.dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
      ) : (
        <AuthModal
          onClose={this.handleDialogClose}
          open={this.state.dialogOpen}
        />
      )}
    </>
  }
}

const mapStateToProps = (state, ownProps) => {
  let initialVote = null
  let currRating = 0
  const { category, postid } = ownProps
  const account = accountInfoSelector(state)
  const ethAuth = ethAuthSelector(state)

  let userVotesForPost = {}

  if (account) {
    const userVotes = state.initialVotes[account.name]
    userVotesForPost = userVotes && userVotes[postid]
    if (state.userPermissions && state.userPermissions[account.name]) {
      account.authority = state.userPermissions[account.name].perm
    }
    if (userVotesForPost) {
      initialVote = userVotesForPost.votes[category]
      if (initialVote) {
        currRating = convertRating(initialVote.like, initialVote.rating)
      }
    }
  }

  const postInfo = state.postInfo[postid]

  return {
    postInfo,
    account,
    currRating,
    ethAuth,
    vote: initialVote,
    votesForPost: userVotesForPost || {}
  }
}

VoteButton.propTypes = {
  account: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  catWeight: PropTypes.number.isRequired,
  currRating: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  voterWeight: PropTypes.number.isRequired,
  rating: PropTypes.object.isRequired,
  initialVote: PropTypes.object.isRequired,
  quantile: PropTypes.string.isRequired,
  vote: PropTypes.object.isRequired,
  listType: PropTypes.string,
  votesForPost: PropTypes.object.isRequired,
  postInfo: PropTypes.object.isRequired,
  ethAuth: PropTypes.object,
  isShown: PropTypes.bool
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(VoteButton))
)
