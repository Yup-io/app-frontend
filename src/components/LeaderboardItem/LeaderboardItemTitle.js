import { LeaderboardItemTitleRoot } from './styles';
import { Typography } from '@mui/material';
import { webAppUrl } from '../../config';
import { TruncateText } from '../styles';

const LeaderboardItemTitle = ({ url, title }) => (
  <LeaderboardItemTitleRoot
    href={url}
    target={url?.startsWith(webAppUrl) ? '' : '_blank'}
  >
    <TruncateText variant="h5" align="left" lines={1}>
      {title}
    </TruncateText>
  </LeaderboardItemTitleRoot>
);

export default LeaderboardItemTitle;
