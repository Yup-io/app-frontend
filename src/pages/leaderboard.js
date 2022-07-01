import LeaderboardContainer from '../components/LeaderboardContainer';
import { PageLayout } from '../components/styles';
import TutorialsProvider from '../providers/TutorialsProvider'
import { LEADERBOARD_TUTORIAL_STEPS } from '../constants/data'

const Leaderboard = () => {
  return (
    <TutorialsProvider steps={LEADERBOARD_TUTORIAL_STEPS}>
      <PageLayout>
        <LeaderboardContainer />
      </PageLayout>
    </TutorialsProvider>
  );
};

export default Leaderboard;
