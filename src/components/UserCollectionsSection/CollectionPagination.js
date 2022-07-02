import numeral from 'numeral';
import { FlexBox } from '../styles';
import IconLeft  from '@mui/icons-material/ChevronLeft';
import IconRight  from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { ArrowButton } from './styles';

const CollectionPagination = ({ page, total, pageSize, onSetPage }) => {
  const maxPage = Math.floor(total / pageSize);

  return (
    <FlexBox alignItems="center">
      <ArrowButton
        size="small"
        disabled={page === 0}
        onClick={() => onSetPage(page - 1)}
      >
        <IconLeft />
      </ArrowButton>
      <Typography
        align="center"
        sx={{
          bgcolor: (theme) => theme.palette.M800,
          py: 0.5,
          width: 30
        }}
      >
        {numeral(page + 1).format('00')}
      </Typography>
      <ArrowButton
        size="small"
        disabled={page >= maxPage}
        onClick={() => onSetPage(page + 1)}
      >
        <IconRight />
      </ArrowButton>
    </FlexBox>
  );
};

export default CollectionPagination;
