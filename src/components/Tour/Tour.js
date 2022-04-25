import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import { Fab, Typography } from '@mui/material'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import { StyledTourResources } from './StyledTourResources'

const styles = theme => ({
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    borderRadius: '5px !important',
    padding: '34px 60px 34px 30px !important'
  },
  tourFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    background: theme.palette.M100,
    color: theme.palette.M800,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  hideOnMobile: {
    display: 'inherit',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})

class Tour extends Component {
  constructor () {
    super()
    this.state = {
      isTourOpen: true
    }
  }

  closeTour = () => {
    this.setState({ isTourOpen: false })
  }

  openTour = () => {
    this.setState({ isTourOpen: true })
  }

  render () {
    const { classes } = this.props
    return (
      <ErrorBoundary>
        <div>
          <Tour
            steps={steps}
            isOpen={this.state.isTourOpen}
            onRequestClose={this.closeTour}
            className={classes.Tour}
            accentColor='#00E08E'
          />
          <Fab
            className={classes.tourFab}
            variant='extended'
            onClick={this.openTour}
          >
            10-Second Tutorial
          </Fab>
        </div>
      </ErrorBoundary>
    )
  }
}

const steps = [
  {
    selector: '[tourName="ProfileUsername"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          👩‍🚀 User Profile
        </Typography>
        <p
          className='tourText'
        >
          Where you'll find important information on each user as well as yourself!
        </p>
        <a href='https://docs.yup.io'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="Influence"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          💯  Yup Score
        </Typography>
        <p className='tourText'>
          A score out of 100 showing how influential a user is. The higher the number, the more powerful your opinions!
        </p>
        <a href='https://docs.yup.io/basic/colors'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="YUPBalance"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          💰  YUP Balance
        </Typography>
        <p className='tourText'>
          The number of tokens you've earned. Rate any piece of content to earn more!
        </p>
        <a href='https://docs.yup.io/protocol/yup-protocol#yup-token'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="ProfileFeed"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          📰  User Feed
        </Typography>
        <p className='tourText'>
          This is the content you're rating, aggregated into a feed.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="Rating"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          🤔  Rating
        </Typography>
        <p className='tourText'>
          You can rate content out of 5 in different categories, such as like ♥️, smart 💡, funny 😂, etc.
        </p>
        <a href='https://docs.yup.io/basic/rating'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="Search"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          🔍  Search
        </Typography>
        <p className='tourText'>
          Search for friends and influencers across the web.
        </p>
      </div>
    )
  },
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          📈  Leaderboard
        </Typography>
        <p className='tourText'>
          Find content and users ranked by category and platform.
        </p>
        <a href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <Typography
          className='tourHeader'
          variant='h4'
        >
          📡  Feeds
        </Typography>
        <p className='tourText'>
          These are your feeds.
        </p>
        <a href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >Learn more</a>
      </div>
    )
  },
  {
    content: (
      <div>
        <Typography variant='h3'
          className='tourHeader'
        >
          👏 That's it !
        </Typography>
        <p className='tourText'>
          That's all for now. Learn more with some of these resources:
        </p>
        <StyledTourResources />
      </div>
    )
  }
]

Tour.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Tour)
