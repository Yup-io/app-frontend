import { HeaderImage, HeaderImageWrapper, HeaderRoot } from './styles';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { FlexBox } from '../styles';

const FeedHeader = ({ categoryData }) => {
  return (
    <HeaderRoot>
      <Tooltip
        placement="bottom"
        disableTouchListener
        title={
          <Typography variant="tooltip">{categoryData.description}</Typography>
        }
      >
        <FlexBox>
          <HeaderImageWrapper>
            <HeaderImage src={categoryData.image} alt={categoryData.title} />
          </HeaderImageWrapper>
          <Typography variant="h3">{categoryData.title}</Typography>
        </FlexBox>
      </Tooltip>
    </HeaderRoot>
  );
};

export default FeedHeader;
