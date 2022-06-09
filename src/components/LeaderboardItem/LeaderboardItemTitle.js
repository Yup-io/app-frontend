import { LeaderboardItemTitleRoot } from './styles';
import { Typography } from '@mui/material'
import { webAppUrl } from '../../config'
import TruncateText from '../TruncateText'

const LeaderboardItemTitle = ({ url, title }) => (
  <LeaderboardItemTitleRoot href={url} target={url.startsWith(webAppUrl) ? "" : "_blank"}>
    <Typography variant="h5" align="left">
      <TruncateText text={title} lines={1} />
    </Typography>
  </LeaderboardItemTitleRoot>
);

export default LeaderboardItemTitle;
