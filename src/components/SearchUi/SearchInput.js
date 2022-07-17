import { StyledInput } from './styles';
import { InputAdornment } from '@mui/material';
import IconSearch from '@mui/icons-material/SearchOutlined';
import { useState } from 'react';

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      onSearch(value);
    }
  };

  return (
    <StyledInput
      fullWidth
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search Yup"
      autoFocus
      startAdornment={
        <InputAdornment position="start">
          <IconSearch />
        </InputAdornment>
      }
    />
  );
};

export default SearchInput;
