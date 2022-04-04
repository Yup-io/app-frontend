import React from 'react'
import PropTypes from 'prop-types'
import VoteComp from '../VoteComp/VoteComp'
import Typography from '@material-ui/core/Typography'
import { levelColors } from '../../utils/colors'
import { withStyles } from '@material-ui/core/styles'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
// import { CollectionPostMenu } from '../Collections'

const voteCompPadding = window.innerWidth >= 440 ? '0 0 3vh 3vh' : '0 0 3vh 1vh'
const styles = theme => ({
  voteComp: {
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      padding: voteCompPadding
    },
    [theme.breakpoints.down('sm')]: {
      padding: '2vh 1vw 2vh 1vw'
    }
  },
  listVoteComp: {
    height: '70px',
    [theme.breakpoints.down('1400')]: {
        display: 'none'
    }
  }
})

function ListPostGrid ({ account,
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
          style={{
            marginBottom: '-10px',
            marginTop: '21px'
          }}
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
          {/* <CollectionPostMenu
            postid={postid}
          /> */}
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

ListPostGrid.propTypes = {
  account: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  postid: PropTypes.number.isRequired,
  weights: PropTypes.object.isRequired,
  quantiles: PropTypes.object,
  postType: PropTypes.string,
  listType: PropTypes.string,
  rating: PropTypes.object.isRequired,
  rank: PropTypes.string,
  categories: PropTypes.array,
  rankCategory: PropTypes.string.catch,
  isList: PropTypes.bool
}

export default (withStyles(styles)(ListPostGrid))
