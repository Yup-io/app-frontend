import useAuth from '../../hooks/useAuth';
import { useUserNotifications } from '../../hooks/queries';
import { FlexBox } from '../styles';
import NotificationItem from './NotificationItem';

const UserNotificationList = () => {
  const { username } = useAuth();
  const notifications = useUserNotifications(username);

  return (
    <FlexBox flexDirection="column" spacing={1.5}>
      {notifications.map((notification) => (
        <NotificationItem key={notification._id} data={notification} />
      ))}
    </FlexBox>
  );
};

export default UserNotificationList;
