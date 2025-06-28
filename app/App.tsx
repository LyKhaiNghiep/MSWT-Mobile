import messaging from '@react-native-firebase/messaging';
import {ThemeProvider} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {theme} from './theme';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useNetInfo} from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {
  offlineMessages,
  sendMessage,
  updateAllDeliveryStatus,
  updateDeliveryStatus,
} from './db/helper';
import {useUser} from './hooks';
import {AppStack} from './navigators/AppStack';
import socket from './services/socket';
function App(): React.JSX.Element {
  const {uid: UID} = useUser();
  const navigationRef = createNavigationContainerRef<any>();
  const {isConnected} = useNetInfo();
  async function saveTokenToDatabase(token: string) {
    await firestore().collection('Users').doc(UID).update({
      fcmToken: token,
    });
  }
  useEffect(() => {
    if (isConnected && !socket.connected) {
      socket.connect();
      socket.emit('join', UID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    (async () => {
      messaging()
        .getToken()
        .then(token => {
          return saveTokenToDatabase(token);
        });
    })();

    async function onConnect() {
      const messages = await offlineMessages();

      messages.map(item => {
        socket.emit(
          'message',
          {
            doctor: UID,
            messageID: item.id,
            message: item.message,
            patient: item.patient,
            sender: UID,
            deliveryStatus: 'sent',
          },
          async (response: any) => {
            //Waiting for a status from the server not from the receiver.
            const {deliveryStatus, messageID} = response;
            await updateDeliveryStatus(deliveryStatus, messageID);
          },
        );
      });
      if (UID?.length! > 10) {
        socket.emit(
          'sync',
          {
            uid: UID,
            role: 'doctor',
          },
          async () => {},
        );
      }
    }

    function onDisconnect() {}

    async function receiveMessage(data: any, callback: any) {
      const {doctor, message, sender, patient} = data;
      await sendMessage({
        deliveryStatus: 'delivered',
        doctor,
        message,
        patient,
        sender,
      });
      callback({
        deliveryStatus: 'delivered',
      });
    }

    async function updateStatus(response: any) {
      const {deliveryStatus: status, messageID, type, doctor} = response;
      //emit delivered if successful
      if (type === 'single') {
        await updateDeliveryStatus(status, messageID);
      } else {
        await updateAllDeliveryStatus('read', doctor, 'sender');
      }
    }

    const handleIncomingCallOffer = (data: any, callback: any) => {
      const {patient, offer} = data;

      if (navigationRef.isReady()) {
        navigationRef.navigate('VideoCall', {
          incomingCall: true,
          patientName: patient.name,
          patientID: patient.id,
          offer,
          avatar: patient.avatar,
        });
      }
      callback({
        callStatus: 'Ringing',
      });
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive', receiveMessage);
    socket.on('incomingCallOffer', handleIncomingCallOffer);
    socket.on('read', updateStatus);
    socket.emit('join', UID);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive', receiveMessage);
      socket.off('read', updateStatus);
      socket.emit('left', UID);
      socket.on('incomingCallOffer', handleIncomingCallOffer);
      messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GestureHandlerRootView>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <BottomSheetModalProvider>
              <AppStack />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default App;
