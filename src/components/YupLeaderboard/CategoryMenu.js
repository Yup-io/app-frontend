import React, { Component } from 'react'
import withStyles from '@mui/styles/withStyles';
import { MenuItem, InputLabel, Select, FormControl } from '@mui/material'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { parseSettings } from '../../utils/yup-list'
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

class CategoryMenu extends Component {
  handleChange = (e) => {
    const { config, history, listOptions } = this.props
    const newCategory = e.target.value
    const newSettings = parseSettings({
      ...config,
      category: newCategory
    }, listOptions)

    const { site, subject, category } = newSettings
    const levelsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`
    history.push(levelsUrl)
  }

  render () {
    const { classes, settings, lightMode } = this.props
    const { category: currCategory, subjCats } = settings

    return (
      <ErrorBoundary>
        <FormControl
          className={classes.formControl}
          size='small'
        >
          <InputLabel
            style={{ fontSize: '12px' }}
          >Category</InputLabel>
          <Select
            onChange={this.handleChange}
            label='Category'
            value={currCategory.name}
          >
            { subjCats.length > 0 &&
              subjCats.map(cat => (
                <MenuItem
                  key={cat.name}
                  value={cat.name}
                >
                  { cat.displayName }
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

CategoryMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired,
  lightMode: PropTypes.array.isRequired
}

export default connect(mapStateToProps)(withRouter(withStyles(styles)(CategoryMenu)))
