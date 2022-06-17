import User from '../../_pages/User/User';
import { PROFILE_TUTORIAL_STEPS } from '../../constants/data'
import TutorialsProvider from '../../providers/TutorialsProvider'

const Account = () => {
  return (
    <TutorialsProvider steps={PROFILE_TUTORIAL_STEPS}>
      <User />
    </TutorialsProvider>
  );
};

export default Account;
