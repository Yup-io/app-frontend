import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Select, MenuItem, InputLabel } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { parseSettings } from '../../utils/yup-list'
import uniqBy from 'lodash/uniqBy'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    [theme.breakpoints.down('xs')]: {
      minWidth: 20
    }
  }
})

class TimeMenu extends Component {
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
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='age-native-helper'
            style={{ opacity: '0.5', fontSize: '11px' }}
          >Time</InputLabel>
          <Select
            type={lightMode ? 'dark' : 'light'}
            label='Where?'
            value={currSite.name}
            onChange={this.handleChange}
            MenuProps={{
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom'
              }
            }}
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

TimeMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired,
  lightMode: PropTypes.bool.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(TimeMenu)))
