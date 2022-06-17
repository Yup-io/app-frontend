import { HeaderImage, HeaderImageWrapper, HeaderRoot } from './styles';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { FlexBox } from '../styles';

const FeedHeader = ({ categoryData, isMinimize }) => {
  console.log(isMinimize, 'isMinimize')
  return (
    <HeaderRoot isMinimize={isMinimize}>
      <Tooltip
        placement="bottom"
        disableTouchListener
        title={
          <Typography variant="tooltip">{categoryData.description}</Typography>
        }
      >
        <FlexBox alignItems="center">
          <HeaderImageWrapper  isMinimize={isMinimize}>
            <HeaderImage src={categoryData.image} alt={categoryData.title} />
          </HeaderImageWrapper>
          <Typography  variant={isMinimize ? 'h2' : 'h3'} 
          style={isMinimize ? { fontSize: '1rem' } : {}}>{categoryData.title}</Typography>
        </FlexBox>
      </Tooltip>
    </HeaderRoot>
  );
};

export default FeedHeader;
