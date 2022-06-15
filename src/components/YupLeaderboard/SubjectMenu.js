import React from 'react';
import { Select, MenuItem, InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { parseSettings } from '../../utils/yup-list';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import useStyles from './CategoryMenuStyles';
import useYupListSettings from '../../hooks/useYupListSettings';

const SubjectMenu = () => {
  const classes = useStyles();
  const settings = useYupListSettings();
  const router = useRouter();

  const listOptions = useSelector((state) => state.yupListSettings.listOptions);

  const handleChange = (e) => {
    const newSubject = e.target.value;
    const { site, subject, category } = router.query;
    const config = { site, subject, category };
    const newSettings = parseSettings(
      {
        ...config,
        subject: newSubject
      },
      listOptions
    );

    const listsUrl = `/leaderboard?site=${newSettings.site.name}&subject=${newSettings.subject.name}&category=${newSettings.category.name}`;

    router.push(listsUrl);
  };

  const { subject: currSubject, siteSubjs } = settings;

  return (
    <ErrorBoundary>
      <FormControl className={classes.formControl} size="small">
        <InputLabel style={{ fontSize: '12px' }}>Subject</InputLabel>
        <Select
          value={currSubject.name}
          onChange={handleChange}
          label="Subject"
        >
          {siteSubjs.length > 0 &&
            siteSubjs.map((subj) => (
              <MenuItem key={subj.name} value={subj.name}>
                {' '}
                {subj.displayName}{' '}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ErrorBoundary>
  );
};

export default SubjectMenu;
