import { useFilters } from './LeaderboardContainer';
import { FlexBox } from '../styles';
import FilterDropdown from './FilterDropdown';
import { useRouter } from 'next/router';

const FilterBar = () => {
  const filters = useFilters();
  const { push } = useRouter();

  if (!filters) return null;

  const {
    platformOptions,
    subjectOptions,
    categoryOptions,
    selectedPlatform,
    selectedSubject,
    selectedCategory
  } = filters;

  const handleChangeFilter = (field, event) => {
    push({
      pathname: '/leaderboard',
      query: {
        category: selectedCategory,
        subject: selectedSubject,
        platform: selectedPlatform,
        [field]: event.target.value
      }
    });
  };

  return (
    <FlexBox>
      <FilterDropdown
        label="Category"
        options={categoryOptions}
        value={selectedCategory}
        valueKey="name"
        textKey="displayName"
        onChange={(e) => handleChangeFilter('category', e)}
      />
      <FilterDropdown
        label="Subject"
        options={subjectOptions}
        value={selectedSubject}
        valueKey="name"
        textKey="displayName"
        onChange={(e) => handleChangeFilter('subject', e)}
      />
      <FilterDropdown
        label="Platform"
        options={platformOptions}
        value={selectedPlatform}
        valueKey="name"
        textKey="displayName"
        onChange={(e) => handleChangeFilter('platform', e)}
      />
    </FlexBox>
  );
};

export default FilterBar;
