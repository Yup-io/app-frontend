import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { parseSettings } from '../../utils/yup-list';
import uniqBy from 'lodash/uniqBy';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import useStyles from './SiteMenuStyles';
import useYupListSettings from '../../hooks/useYupListSettings';

const SiteMenu = () => {
  const classes = useStyles();
  const settings = useYupListSettings();
  const router = useRouter();

  const listOptions = useSelector((state) => state.yupListSettings.listOptions);
  const lightMode = useSelector((state) => state.lightMode.active);

  const handleChange = (e) => {
    const newSite = e.target.value;
    const { site, subject, category } = router.query;
    const config = { site, subject, category };

    const newSettings = parseSettings(
      {
        ...config,
        site: newSite
      },
      listOptions
    );

    const levelsUrl = `/leaderboard?site=${newSettings.site.name}&subject=${newSettings.subject.name}&category=${newSettings.category.name}`;
    router.push(levelsUrl);
  };

  const { site: currSite } = settings;
  const filteredOpts = uniqBy(
    [{ location: { name: 'all', displayName: 'all' } }, ...listOptions],
    'location.name'
  );

  return (
    <ErrorBoundary>
      <FormControl className={classes.formControl} size="small">
        <InputLabel style={{ fontSize: '12px' }}>Platform</InputLabel>
        <Select
          type={lightMode ? 'dark' : 'light'}
          label="Where?"
          value={currSite.name}
          onChange={handleChange}
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

export default SiteMenu;
