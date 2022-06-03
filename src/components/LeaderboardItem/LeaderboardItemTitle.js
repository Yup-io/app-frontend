import { ResponsiveEllipsis } from '../Miscellaneous';
import { LeaderboardItemTitleRoot } from './styles';

const LeaderboardItemTitle = ({ title }) => (
  <LeaderboardItemTitleRoot variant="h5">
    <ResponsiveEllipsis text={title} ellipsis="..." maxLine={1} trimRight />
  </LeaderboardItemTitleRoot>
);

export default LeaderboardItemTitle;
