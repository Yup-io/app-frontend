import { YupContainer, YupPageWrapper } from '../components/styles';
import YupPageHeader from '../components/YupPageHeader';
import { Typography } from '@mui/material';
import UserNotificationList from '../components/UserNotificationList';

const Notifications = () => {
  return (
    <YupPageWrapper>
      <YupPageHeader noborder>
        <YupContainer>
          <Typography variant="h3">
            Notifications
          </Typography>
        </YupContainer>
      </YupPageHeader>
      <YupContainer sx={{ py: 3 }}>
        <UserNotificationList />
      </YupContainer>
    </YupPageWrapper>
  );
};

export default Notifications;
