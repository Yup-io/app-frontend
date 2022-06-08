import { ResponsiveEllipsis } from '../Miscellaneous';
import { LeaderboardItemTitleRoot } from './styles';
import { Typography } from '@mui/material'
import { webAppUrl } from '../../config'

const LeaderboardItemTitle = ({ url, title }) => (
  <LeaderboardItemTitleRoot href={url} target={url.startsWith(webAppUrl) ? "" : "_blank"}>
    <Typography variant="h5" align="left">
      <ResponsiveEllipsis text={title} ellipsis="..." maxLine={1} trimRight />
    </Typography>
  </LeaderboardItemTitleRoot>
);

export default LeaderboardItemTitle;
