import useAuth from '../../hooks/useAuth';
import { useSocialLevel, useUserNotifications } from '../../hooks/queries';
import NotificationItem from './NotificationItem';
import withSuspense from '../../hoc/withSuspense';
import { List } from '@mui/material';
import { LOADER_TYPE, LOCAL_STORAGE_KEYS } from '../../constants/enum';
import { useEffect, useState } from 'react';
import wallet from '../../eos/scatter/scatter.wallet';
import { apiSetNotificationSeenEth, apiSetNotificationSeenScatter } from '../../apis';
import { ETH_NOTIFICATION_INTERVAL } from '../../constants/const';
import { ETH_LINK_NOTIFICATION_DATA } from '../../constants/data';

const UserNotificationList = () => {
  const { username, authInfo } = useAuth();
  const profile = useSocialLevel(username);
  const notifications = useUserNotifications(username);
  const [showEthLinkNotification, setShowEthLinkNotification] = useState(false);

  useEffect(() => {
    if (!notifications?.length) return ;

    const setNotificationsRead = async () => {
      const unseenNotifications = notifications.filter((notification) => !notification.seen);

      if (!authInfo) {
        const { signature, eosname } = await wallet.scatter.getAuthToken();

        await Promise.all(unseenNotifications.map((notification) => apiSetNotificationSeenScatter(notification._id, signature, eosname)));
      } else {
        const { signature, address } = authInfo;

        await Promise.all(unseenNotifications.map((notification) => apiSetNotificationSeenEth(notification._id, signature, address)));
      }
    };

    setNotificationsRead();
  }, [notifications, authInfo]);

  useEffect(() => {
    if (!profile) return ;
    if (profile.ethInfo?.address) return ;

    const lastEthTimestamp = localStorage.getItem(LOCAL_STORAGE_KEYS.ETH_NOTIFICATION_TIMESTAMP);
    const currentTimestamp = new Date().getTime();

    if (!lastEthTimestamp || lastEthTimestamp < currentTimestamp - ETH_NOTIFICATION_INTERVAL) {
      setShowEthLinkNotification(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ETH_NOTIFICATION_TIMESTAMP, currentTimestamp);
    }
  }, [profile]);

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column-reverse'
      }}
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification._id} data={notification} />
      ))}
      {showEthLinkNotification && (
        <NotificationItem
          data={{
            ...ETH_LINK_NOTIFICATION_DATA,
            link: `/account/${username}?dialogOpen=true`,
            createdAt: new Date().getTime()
          }}
        />
      )}
    </List>
  );
};

export default withSuspense(LOADER_TYPE.NOTIFICATION, 5)(UserNotificationList);
