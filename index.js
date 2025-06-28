/**
 * @format
 */
import notifee from '@notifee/react-native';

import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './app/App';
import {localStore} from './app/data/mmkvZustand';

async function onDisplayNotification(name) {
  await notifee.requestPermission();

  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Wellbeing',
  });

  await notifee.displayNotification({
    title: 'Verification Complete 🎉',
    body: `Hey ${name}, your documents and profile have been successfully verified. You're all set to proceed!`,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
}
async function onMessageReceived(message) {
  console.log(message);

  const {data} = message;
  localStore.setState({verificationStatus: data.status});
  localStore.setState({verified: data.status === 'verified' ? true : false});

  await onDisplayNotification(data.name);
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

database().setPersistenceEnabled(true);
AppRegistry.registerComponent(appName, () => App);
