import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles';
import { Select, MenuItem, InputLabel } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import PropTypes from 'prop-types'
import { parseSettings } from '../../utils/yup-list'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    [theme.breakpoints.down('sm')]: {
      minWidth: 20
    }
  }
})

class SubjectMenu extends Component {
  handleChange = (e) => {
    const newSubject = e.target.value
    const { history, config, listOptions } = this.props
    const newSettings = parseSettings({
      ...config,
      subject: newSubject
    }, listOptions)
    const { site, subject, category } = newSettings
    const listsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`
    history.push(listsUrl)
  }

  render () {
    const { classes, settings } = this.props
    const { subject: currSubject, siteSubjs } = settings

    return (
      <ErrorBoundary>
        <FormControl className={classes.formControl}
          variant='outlined'
          size='small'
        >
          <InputLabel htmlFor='age-native-helper'
            style={{ fontSize: '12px' }}
          >Subject</InputLabel>
          <Select
            labelWidth='44'
            value={currSubject.name}
            onChange={this.handleChange}
            MenuProps={{
              getContentAnchorEl: null,
              anchorOrigin: {
                vertical: 'bottom'
              }
            }}
            color='third'
          >
            { siteSubjs.map(subj => (
              <MenuItem
                value={subj.name}
                color='third'
              > {subj.displayName} </MenuItem>))}
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
  return { config, settings, listOptions }
}

SubjectMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(SubjectMenu)))
