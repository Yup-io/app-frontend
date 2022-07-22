import LeaderboardContainer from '../components/LeaderboardContainer';
import { YupPageWrapper } from '../components/styles';
import TutorialsProvider from '../providers/TutorialsProvider'
import { LEADERBOARD_TUTORIAL_STEPS } from '../constants/data'

const Leaderboard = () => {
  return (
    <TutorialsProvider steps={LEADERBOARD_TUTORIAL_STEPS}>
      <YupPageWrapper>
        <LeaderboardContainer />
      </YupPageWrapper>
    </TutorialsProvider>
  );
};

export default Leaderboard;
