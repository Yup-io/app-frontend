import React from 'react'
import PropTypes from 'prop-types'
import VoteComp from '../VoteComp/VoteComp'
import Typography from '@material-ui/core/Typography'
import { levelColors } from '../../utils/colors'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import CollectionPostMenu from '../Collections/CollectionPostMenu'

const voteCompPadding = window.innerWidth >= 440 ? '0 0 3vh 3vh' : '0 0 3vh 1vh'
const styles = theme => ({
  voteComp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5vh 0vw 0px 0vw',
    height: '60px',
    [theme.breakpoints.down('xs')]: {
      padding: voteCompPadding
    },
    [theme.breakpoints.down('sm')]: {
      padding: '2vh 1vw 2vh 1vw'
    }
  },
  listVoteComp: {
    height: '100px',
    background: 'transparent'
  }
})

function PostGrid ({ account,
  postid,
  quantiles,
  weights,
  classes,
  postType,
  rank,
  listType,
  categories,
  rating,
  rankCategory,
  isList,
  caption
}) {
  const rankQuantile = quantiles[rankCategory]
  const rankQuantileColor = rank ? levelColors[rankQuantile] : null
  const listStyle = isList ? `${classes.listVoteComp}` : ''

  return (
    <ErrorBoundary>
      <div className={`${classes.voteComp} ${listStyle}`}
        tourname='Rating'
      >
        <VoteComp
          caption={caption}
          account={account}
          postid={postid}
          quantiles={quantiles}
          rating={rating}
          weights={weights}
          categories={categories}
          listType={listType}
          postType={postType}
        />
        <CollectionPostMenu
          accountName={account && account.name}
          postid={postid}
        />
        {
          rank
            ? <Typography style={{
              background: '#1A1A1A40',
              borderRadius: '100%',
              minWidth: '1rem',
              padding: '0.5rem',
              fontFamily: 'Gilroy',
              color: rankQuantileColor,
              fontWeight: '400',
              fontSize: '14px' }}
            > {`#${rank}`} </Typography>
            : null
        }
      </div>
    </ErrorBoundary>
  )
}

PostGrid.propTypes = {
  account: PropTypes.object,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postid: PropTypes.string.isRequired,
  weights: PropTypes.object.isRequired,
  quantiles: PropTypes.object,
  postType: PropTypes.string,
  listType: PropTypes.string,
  rating: PropTypes.object.isRequired,
  rank: PropTypes.string,
  categories: PropTypes.array,
  rankCategory: PropTypes.string,
  isList: PropTypes.bool
}

export default (withStyles(styles)(PostGrid))
