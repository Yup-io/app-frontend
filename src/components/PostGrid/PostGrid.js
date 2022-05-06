import React from 'react'
import PropTypes from 'prop-types'
import VoteComp from '../VoteComp/VoteComp'
import { levelColors } from '../../utils/colors'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { CollectionPostMenu } from '../Collections'
import { Typography, Grid } from '@mui/material'

import withStyles from '@mui/styles/withStyles'

const voteCompPadding = window.innerWidth >= 440 ? '0 0 3vh 3vh' : '0 0 3vh 1vh'

const styles = theme => ({
  voteComp: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: voteCompPadding
    },
    [theme.breakpoints.down('md')]: {
      padding: '2vh 1vw 2vh 1vw'
    }
  },
  listVoteComp: {
    height: '100px',
    background: 'transparent'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  collectButton: {
    marginRight: '10px'
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
      <Grid container
        className={classes.container}
      >
        <Grid item
          xs={9}
          tourname='Rating'
          className={`${classes.voteComp} ${listStyle}`}
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
        </Grid>
        <Grid item
          xs={2.5}
        >
          <CollectionPostMenu
            accountName={account && account.name}
            postid={postid}
          />
        </Grid>
      </Grid>
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
