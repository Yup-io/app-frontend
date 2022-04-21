import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles'
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { parseSettings } from '../../utils/yup-list'
import uniqBy from 'lodash/uniqBy'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    [theme.breakpoints.down('sm')]: {
      minWidth: 20
    }
  }
})

class SiteMenu extends Component {
  handleChange = (e) => {
    const { history, config, listOptions } = this.props
    const newSite = e.target.value
    const newSettings = parseSettings({
      ...config,
      site: newSite
    }, listOptions)
    const { site, subject, category } = newSettings
    const levelsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`
    history.push(levelsUrl)
  }

  render () {
    const { classes, settings, listOptions, lightMode } = this.props
    const { site: currSite } = settings

    const filteredOpts = uniqBy([{ location: { name: 'all', displayName: 'all' } }, ...listOptions], 'location.name')
    return (
      <ErrorBoundary>
        <FormControl className={classes.formControl}
          variant='outlined'
        >
          <InputLabel
            style={{ fontSize: '12px' }}
          >Platform</InputLabel>
          <Select
            type={lightMode ? 'dark' : 'light'}
            label='Where?'
            labelWidth='52'
            value={currSite.name}
            onChange={this.handleChange}
          >{
              filteredOpts.map((opt) => (
                <MenuItem
                  value={opt.location.name}
                >
                  {opt.location.displayName}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </ErrorBoundary>
    )
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
  const lightMode = state.lightMode.active
  return { config, settings, listOptions, lightMode }
}

SiteMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired,
  lightMode: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(SiteMenu)))
