import React  from 'react'
import { MenuItem, InputLabel, Select, FormControl } from '@mui/material'
import { useRouter } from 'next/router'
import { parseSettings } from '../../utils/yup-list'
import { useSelector } from 'react-redux'
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary'
import useYupListSettings from '../../hooks/useYupListSettings'
import useStyles from './CategoryMenuStyles';

const CategoryMenu = () => {
  const classes = useStyles();
  const settings = useYupListSettings();
  const router = useRouter();

  const listOptions = useSelector((state) => state.yupListSettings.listOptions);

  const handleChange = (e) => {
    const newCategory = e.target.value
    const { site, subject, category } = router.query;
    const config = { site, subject, category };
    const newSettings = parseSettings({
      ...config,
      category: newCategory
    }, listOptions)

    const levelsUrl = `/leaderboard?site=${newSettings.site.name}&subject=${newSettings.subject.name}&category=${newSettings.category.name}`

    router.push(levelsUrl)
  }

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
          onChange={handleChange}
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

export default CategoryMenu;
