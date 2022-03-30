import React, { Component, memo } from 'react'
import PropTypes from 'prop-types'
import YupLeaderboard from '../../components/YupLeaderboard/YupList'
import { connect } from 'react-redux'
import { Grid, Fab, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { setListOptions, setTourAction } from '../../redux/actions'
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary'
import Tour from 'reactour'
import '../../components/Tour/tourstyles.css'
import axios from 'axios'
import ReactPlayer from 'react-player'
import Fade from '@material-ui/core/Fade'
import isEqual from 'lodash/isEqual'
import { CreateCollectionFab, StyledTourResources, YupButton } from '../../components/Miscellaneous'
import { PageBody } from '../pageLayouts'

const { BACKEND_API } = process.env
const EXPLAINER_VIDEO = 'https://www.youtube.com/watch?v=UUi8_A5V7Cc'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
    maxWidth: '100vw',
    marginBottom: '0',
    paddingBottom: '0',
    overflowY: 'hidden',
    overflowX: 'hidden'
  },
  gridContainer: {
    paddingTop: '30px'
  },
  page: {
    // padding: '0px 15vw 0 20vw',
    // [theme.breakpoints.down('xs')]: {
    //   padding: '0px 1rem'
    // },
    // [theme.breakpoints.up('xl')]: {
    //   padding: '0px 17vw 0px 17vw'
    // }
  },
  Tour: {
    fontFamily: '"Gilroy", sans-serif',
    padding: '20px 40px 20px 30px !important'
  },
  tourFab: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(12),
    zIndex: 1000,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  hideOnMobile: {
    display: 'inherit',
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  Mask: {
    outline: 'solid 0px #FAFAFA44'
  }
})

class YupLists extends Component {
  state = {
    isLoading: true
  }
  async fetchListOptions () {
    const { setListOpts } = this.props
    const updatedListOpts = (
      await axios.get(`${BACKEND_API}/v1/lists/listInfo`)
    ).data
    setListOpts(updatedListOpts)
    this.setState({ isLoading: false })
  }
  state = {
    isTourOpen: false,
    showTour: true
  }

  componentDidMount () {
    if (window.analytics) {
      window.analytics.page('Yup Lists')
    }

    this.fetchListOptions()
    setTimeout(() => {
      this.setState({
        showTour: false
      })
    }, 30000)
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }

  render () {
    const { classes, setTour, tour } = this.props
    return (
      <ErrorBoundary>
        <div className={classes.container}>
          <PageBody pageClass={classes.page}>
            {!this.state.isLoading && (
              <Grid
                className={classes.gridContainer}
                container
                justify='center'
              >
                <YupLeaderboard />
              </Grid>
            )}
            <Tour
              steps={steps}
              isOpen={tour}
              onRequestClose={() => {
                setTour({ isTourOpen: false })
              }}
              className={classes.Tour}
              accentColor='#00E08E'
              rounded={10}
              disableInteraction
              highlightedMaskClassName={classes.Mask}
              nextButton={
                <YupButton size='small'
                  variant='contained'
                  color='primary'
                >Next</YupButton>
              }
              prevButton={
                <YupButton size='small'
                  variant='contained'
                  color='primary'
                >Back</YupButton>
              }
              lastStepNextButton={<div style={{ display: 'none' }} />}
            />
            <Fade in={this.state.showTour}
              timeout={1000}
            >
              <Fab
                className={classes.tourFab}
                variant='extended'
                onClick={() => {
                  setTour({ isTourOpen: true })
                }}
              >
                10-Second Tutorial
              </Fab>
            </Fade>
            <CreateCollectionFab />
          </PageBody>
        </div>
      </ErrorBoundary>
    )
  }
}

YupLists.propTypes = {
  classes: PropTypes.object.isRequired,
  setListOpts: PropTypes.func.isRequired,
  setTour: PropTypes.func.isRequired,
  tour: PropTypes.bool
}

const steps = [
  {
    selector: '[tourName="LeaderboardButton"]',
    content: (
      <>
        <Typography className='tourHeader'
          variant='h4'
        >
          📈 Leaderboard
        </Typography>
        <p className='tourText'>
          Find content and users ranked by category and platform.
        </p>
        <a
          href='https://docs.yup.io/products/app#lists'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </>
    )
  },
  {
    selector: '[tourName="LeaderboardMenu"]',
    content: (
      <div>
        <Typography className='tourHeader'
          variant='h4'
        >
          ‍📊 Leaderboard Menu
        </Typography>
        <p className='tourText'>Here you can edit and filter leaderboards.</p>
      </div>
    )
  },
  {
    selector: '[tourName="Rating"]',
    content: (
      <div>
        <Typography className='tourHeader'
          variant='h4'
        >
          🤔 Rating
        </Typography>
        <p className='tourText'>
          You can rate content out of 5 in different categories, such as like
          ♥️, smart 💡, funny 😂, etc.
        </p>
        <a
          href='https://docs.yup.io/basic/rating'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    selector: '[tourName="FeedsDrawer"]',
    content: (
      <div>
        <Typography className='tourHeader'
          variant='h4'
        >
          📡 Feeds
        </Typography>
        <p className='tourText'>These are your feeds.</p>
        <a
          href='https://docs.yup.io/products/app#feed'
          target='_blank'
          className='tourLink'
        >
          Learn more
        </a>
      </div>
    )
  },
  {
    content: (
      <div>
        <Typography className='tourHeader'
          variant='h3'
        >
          👏 That's it !
        </Typography>
        <p className='tourText'>
          That's all for now. Learn more with some of these resources:
        </p>
        <StyledTourResources />
        <ReactPlayer
          controls
          style={{ overFlow: 'hidden', maxHeight: '200px' }}
          url={EXPLAINER_VIDEO}
          width='100%'
        />
      </div>
    )
  }
]

const mapStateToProps = (state, ownProps) => {
  return {
    tour: state.tour.isTourOpen
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setListOpts: listOpts => dispatch(setListOptions(listOpts)),
    setTour: tour => dispatch(setTourAction(tour))
  }
}

export default memo(
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(YupLists))
)
