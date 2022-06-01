import React from 'react';
import { MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { useRouter } from 'next/router';
import { parseSettings } from '../../utils/yup-list';
import { useSelector } from 'react-redux';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import useYupListSettings from '../../hooks/useYupListSettings';
import useStyles from './CategoryMenuStyles';

const CategoryMenu = () => {
  const classes = useStyles();
  const settings = useYupListSettings();
  const router = useRouter();

  const handleChange = (e) => {
    const newCategory = e.target.value;

    router.push({
      pathname: '/leaderboard',
      query: {
        ...router.query,
        category: newCategory
      }
    });
  };

  const { category: currCategory, subjCats } = settings;

  return (
    <ErrorBoundary>
      <FormControl className={classes.formControl} size="small">
        <InputLabel style={{ fontSize: '12px' }}>Category</InputLabel>
        <Select
          onChange={handleChange}
          label="Category"
          value={currCategory.name}
        >
          {subjCats.length > 0 &&
            subjCats.map((cat) => (
              <MenuItem key={cat.name} value={cat.name}>
                {cat.displayName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </ErrorBoundary>
  );
};

export default CategoryMenu;
