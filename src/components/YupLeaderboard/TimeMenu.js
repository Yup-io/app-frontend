import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import { Select, MenuItem, InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { parseSettings } from '../../utils/yup-list';
import uniqBy from 'lodash/uniqBy';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useThemeMode } from '../../contexts/ThemeModeContext';

const styles = (theme) => ({
  formControl: {
    minWidth: 100,
    [theme.breakpoints.down('sm')]: {
      minWidth: 20
    }
  }
});

const TimeMenu = ({ router, config, listOptions, settings, classes }) => {
  const { isLightMode } = useThemeMode();

  const handleChange = (e) => {
    const newSite = e.target.value;
    const newSettings = parseSettings(
      {
        ...config,
        site: newSite
      },
      listOptions
    );
    const { site, subject, category } = newSettings;
    const levelsUrl = `/leaderboard?site=${site.name}&subject=${subject.name}&category=${category.name}`;
    router.push(levelsUrl);
  };

  const { site: currSite } = settings;

  const filteredOpts = uniqBy(
    [{ location: { name: 'all', displayName: 'all' } }, ...listOptions],
    'location.name'
  );

  return (
    <ErrorBoundary>
      <FormControl className={classes.formControl}>
        <InputLabel
          htmlFor="age-native-helper"
          style={{ opacity: '0.5', fontSize: '11px' }}
        >
          Time
        </InputLabel>
        <Select
          type={isLightMode ? 'dark' : 'light'}
          label="Where?"
          value={currSite.name}
          onChange={handleChange}
          MenuProps={{
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: 'bottom'
            }
          }}
        >
          {filteredOpts.map((opt) => (
            <MenuItem value={opt.location.name}>
              {opt.location.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ErrorBoundary>
  );
};

const mapStateToProps = (state) => {
  const { router, yupListSettings } = state;
  const config = {
    site: router.location.query.site,
    subject: router.location.query.subject,
    category: router.location.query.category
  };
  const { listOptions } = yupListSettings;
  const settings = parseSettings(config, listOptions);
  return { config, settings, listOptions };
};

TimeMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  listOptions: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(
  withRouter(withStyles(styles)(TimeMenu))
);
