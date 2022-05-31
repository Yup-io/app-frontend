import { FilterFormControl } from './styles'
import { InputLabel, MenuItem, Select } from '@mui/material'

const FilterDropdown = ({ label, options, value, onChange, valueKey, textKey }) => {
  return (
    <FilterFormControl size="small">
      <InputLabel>
        {label}
      </InputLabel>
      <Select
        label={label}
        onChange={onChange}
        value={value}
      >
        {options.map((item) => (
          <MenuItem
            key={item[valueKey || 'value']}
            value={item[valueKey || 'value']}
          >
            { item[textKey || 'text'] }
          </MenuItem>
        ))}
      </Select>
    </FilterFormControl>
  );
};

export default FilterDropdown;
