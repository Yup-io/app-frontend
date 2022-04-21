import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography'
import { Grid } from '@mui/material'
import CategoryMenu from './CategoryMenu'
import SiteMenu from './SiteMenu'
import SubjectMenu from './SubjectMenu'
import PropTypes from 'prop-types'
import { parseSettings } from '../../utils/yup-list'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import cap from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import YupListSearchBar from './YupListSearchBar'
import isEqual from 'lodash/isEqual'

const styles = theme => ({
  infoContainer: {
    margin: '10px auto',
    maxHeight: '200px',
    width: '100%'
  },
  rootContainer: {
    margin: '45px auto 0 auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflowY: 'hidden',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      margin: '30px 16px 0'
    }
  },
  Tab: {
    minWidth: '60px'
  },
  hidden: {
    visibility: 'hidden'
  },
  minimizeTitle: {
    fontSize: '24px'
  },
  minimizeCard: {
    maxHeight: '60px',
    transition: 'max-height 0.15s linear',
    overflow: 'hidden'
  },
  filters: {
    marginTop: '15px'
  },
  search: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
})

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <ErrorBoundary>
      <Typography
        component='div'
        role='tabpanel'
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    </ErrorBoundary>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

class YupListsMenu extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      return true
    }
    return false
  }
  render () {
    const { classes, settings, isMinimize } = this.props

    const { site, preposition, category, subject } = settings
    const siteMeta = site.altName || cap(site.displayName)
    const catMeta = category.altName || cap(category.displayName)
    const subjectMeta = subject.altName || cap(subject.displayName)

    const siteText = preposition ? `${preposition} ${siteMeta}` : ''
    const customMetaTitle = `${catMeta} ${subjectMeta} ${siteText}| Yup`
    // TODO: The title doesn't change
    const defaultMetaTitle = 'Yup • Rate the Web. Earn & Influence.'
    const metaTitle = site.length ? customMetaTitle : defaultMetaTitle

    const catTitleText = category.altName || cap(category.displayName)
    const subjTitleText = subject.altName || (subject.displayName.includes('NFT') ? subject.displayName : cap(subject.displayName))
    const siteTitleText = site.altName || cap(site.displayName)
    const prepTitleText = preposition && siteTitleText !== 'All' ? `${preposition} ${siteTitleText}` : ''
    const dynamicListTitle = `${catTitleText} ${subjTitleText} ${prepTitleText}`

    const hidden = isMinimize ? classes.hidden : null
    const listTitle = isMinimize ? classes.minimizeTitle : classes.listTitle
    const minimizeCard = isMinimize ? classes.minimizeCard : null
    const isMobile = window.innerWidth <= 600

    return (
      <Fade in
        timeout={2000}
      >
        <div className={classes.rootContainer}>
          <Helmet>
            <meta charSet='utf-8' />
            <title> {metaTitle} </title>
            <meta name='description'
              content={dynamicListTitle}
            />
          </Helmet>
          <div className={`${classes.infoContainer} ${minimizeCard}`}>
            <Grid container
              alignItems='flex-start'
              direction='column'
              tourname='LeaderboardMenu'
            >
              <Grid item>
                <Typography
                  variant='body2'
                  style={{ opacity: 0.3 }}
                > Leaderboard
                </Typography>
                <Typography
                  variant='h2'
                  className={listTitle}
                > {dynamicListTitle}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container
                  alignItems='center'
                  direction='row'
                  justifyContent='space-between'
                  spacing={1}
                  className={`${classes.filters} ${hidden}`}
                  tourname='ListsFilters'
                >
                  <Grid item
                    xs={12}
                    sm={8}
                    md={9}
                    lg={8}
                  >
                    <Grid container
                      spacing={isMobile ? 1 : 2}
                      wrap='nowrap'
                    >
                      <Grid
                        item
                      >
                        <CategoryMenu />
                      </Grid>
                      <Grid
                        item
                      >
                        <SubjectMenu />
                      </Grid>
                      <Grid
                        item
                      >
                        <SiteMenu />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    sm={3}
                    md={3}
                    className={classes.search}
                  >
                    <YupListSearchBar />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Fade>
    );
  }
}

const mapStateToProps = (state) => {
  const { router, yupListSettings } = state
  const config = {
    site: router.location.query.site,
    subject: router.location.query.subject,
    category: router.location.query.category
  }
  const { listOptions } = yupListSettings
  const settings = parseSettings(config, listOptions)
  return { settings }
}

YupListsMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  isMinimize: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(withStyles(styles)(YupListsMenu))
