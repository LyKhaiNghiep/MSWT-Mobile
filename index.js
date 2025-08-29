/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {name as appName} from './app.json';
import App from './app/App';

AppRegistry.registerComponent(appName, () => App);

// Global background handler for data-only messages (app in background or quit)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    const title = String(
      remoteMessage.notification?.title ??
        remoteMessage.data?.title ??
        'Thông báo',
    );
    const body = String(
      remoteMessage.notification?.body ??
        remoteMessage.data?.body ??
        'Bạn có thông báo mới',
    );
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
    await notifee.displayNotification({title, body, android: {channelId}});
  } catch (e) {
    // Avoid crashing the handler
  }
});
