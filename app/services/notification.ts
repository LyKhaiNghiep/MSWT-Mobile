import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {useEffect} from 'react';
import {useAlerts} from '../hooks/useAlert';

export const displayNotification = async (title: string, body: string) => {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Display notification
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
      },
    },
  });
};

export const useNotificationSetup = () => {
  const {alerts} = useAlerts();

  useEffect(() => {
    // Set up foreground handler
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.PRESS) {
        // Handle notification press
        console.log('User pressed notification', detail.notification);
      }
    });

    // Set up background handler
    notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        // Handle notification press
        console.log('User pressed notification', detail.notification);
      }
    });

    return () => unsubscribe();
  }, []);

  // Watch for new alerts
  useEffect(() => {
    const lastAlert = alerts[0]; // Assuming alerts are sorted by date
    if (lastAlert && !lastAlert.resolvedAt) {
      displayNotification('Thông báo mới', `Có thông báo mới cần xử lý`);
    }
  }, [alerts]);
};
