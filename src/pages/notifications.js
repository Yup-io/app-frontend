import { YupContainer, YupPageWrapper } from '../components/styles';
import YupPageHeader from '../components/YupPageHeader';
import { Typography } from '@mui/material';

const Notifications = () => {
  return (
    <YupPageWrapper>
      <YupPageHeader>
        <YupContainer>
          <Typography variant="h3">
            Notifications
          </Typography>
        </YupContainer>
      </YupPageHeader>
      <YupContainer>

      </YupContainer>
    </YupPageWrapper>
  );
};

export default Notifications;
