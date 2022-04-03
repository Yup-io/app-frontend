import React, { Component } from 'react'
import VoteButton from '../VoteButton/VoteButton'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { fetchInitialVotes, fetchSocialLevel } from '../../redux/actions'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { accountInfoSelector } from '../../redux/selectors'

const VOTE_CATEGORIES = process.env.VOTE_CATEGORIES.split(',')
const PROF_CATEGORIES = process.env.PROF_CATEGORIES.split(',')
const MAPS_CATEGORIES = process.env.MAPS_CATEGORIES.split(',')
const COURSE_CATEGORIES = process.env.COURSE_CATEGORIES.split(',')
const ELECTION_CATEGORIES = process.env.ELECTION_CATEGORIES.split(',')
const NFT_ART_CATEGORIES = process.env.NFT_ART_CATEGORIES.split(',')
const NFT_MUSIC_CATEGORIES = process.env.NFT_MUSIC_CATEGORIES.split(',')

function genRegEx (arrOfURLs) {
  return new RegExp(`^((http:|https:)([/][/]))?(www.)?(${arrOfURLs.join('|')})`)
}

const artPattern = genRegEx(['rarible.com/*', 'app.rarible.com/*', 'opensea.io/assets/*', 'superrare.co/*', 'superrare.co/*', 'foundation.app/*/', 'zora.co/*', 'knownorigin.io/gallery/*'])
const musicPattern = genRegEx(['audius.co/*', 'open.spotify.com/*', 'soundcloud.com/*', 'music.apple.com/us/(artist|album)/*'])

class VoteComp extends Component {
  state = {
    isShown: false
  }

  componentDidMount () {
    this.fetchInitialVotes()
  }

  async fetchInitialVotes () {
    const { postid, account, dispatch } = this.props
    if (account == null) { return }
    await dispatch(fetchInitialVotes(account.name, postid))
  }

  render () {
    const { account, dispatch, postid, caption, quantiles, levels, weights, postType, rating, categories: _categories, listType } = this.props
    const isMobile = window.innerWidth <= 600
    let voterWeight = 0
    if (account && account.name) {
      if (!levels[account.name]) {
        dispatch(fetchSocialLevel(account.name))
      }
      const level = levels[account.name]
      if (level && !level.isLoading && level.levelInfo && level.levelInfo.weight) {
        voterWeight = level.levelInfo.weight
      }
    }

    let categories

    if (_categories == null) {
      // TODO: Make this configurable
      if (postType === 'columbia-course-registration:courses') {
        categories = COURSE_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'columbia-course-registration:professors') {
        categories = PROF_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'maps.google.com') {
        categories = MAPS_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (postType === 'politics:candidates' && listType === 'politics:candidates') {
        categories = ELECTION_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (caption && caption.match(artPattern)) {
        categories = NFT_ART_CATEGORIES.filter((cat) => cat !== 'overall')
      } else if (caption && caption.match(musicPattern)) {
        categories = NFT_MUSIC_CATEGORIES.filter((cat) => cat !== 'overall')
      } else {
        categories = VOTE_CATEGORIES.filter((cat) => cat !== 'overall')
      }
    } else {
      categories = _categories
    }

    return (
      <ErrorBoundary>
        <div style={{
          display: 'flex',
          marginLeft: '8px',
          maxWidth: '100%'
        }}
        onMouseEnter={() => this.setState({ isShown: true })}
        onMouseLeave={() => this.setState({ isShown: false })}
        >
          { categories.map((cat) => {
            return (
              <VoteButton
                category={cat}
                catWeight={weights[cat]}
                key={cat}
                rating={rating}
                postid={postid}
                listType={listType}
                quantile={quantiles[cat]}
                voterWeight={voterWeight}
                isShown={isMobile ? false : this.state.isShown}
              />
            )
          })
          }
        </div>
      </ErrorBoundary>
    )
  }
}

VoteComp.propTypes = {
  account: PropTypes.object,
  caption: PropTypes.string.isRequired,
  postid: PropTypes.string.isRequired,
  quantiles: PropTypes.object.isRequired,
  weights: PropTypes.object.isRequired,
  levels: PropTypes.number.isRequired,
  rating: PropTypes.object.isRequired,
  postType: PropTypes.string,
  listType: PropTypes.string,
  categories: PropTypes.array,
  dispatch: PropTypes.func.isRequired
}

VoteComp.defaultProps = {
  weights: {
    intelligence: null,
    popularity: null,
    overall: null,
    funny: null
  },
  voterWeight: 0
}

const mapStateToProps = (state, ownProps) => {
  const account = accountInfoSelector(state)

  if (account && state.userPermissions && state.userPermissions[account.name]) {
    account.authority = state.userPermissions[account.name].perm
  }

  let initialVotes = { votes: {}, isLoading: false, error: null }
  if (account && account.name) {
    const userVotes = state.initialVotes[account.name]
    const userVotesForPost = userVotes && userVotes[ownProps.postid]
    if (userVotesForPost) {
      initialVotes = userVotesForPost
    }
  }

  return {
    levels: state.socialLevels.levels || {
      isLoading: true,
      levels: {}
    },
    initialVotes,
    account
  }
}

export default connect(mapStateToProps)(VoteComp)
