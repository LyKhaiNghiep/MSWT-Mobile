import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {Box, Gradient, Screen, Text} from '../../components';
import {localStore} from '../../data';
import {moderateScale} from '../../utils';

export const VerificationStatus = () => {
  const {fullName, UID} = localStore();

  async function saveTokenToDatabase(token: string) {
    await firestore().collection('Users').doc(UID).update({
      fcmToken: token,
    });
  }
  useEffect(() => {
    (async () => {
      messaging()
        .getToken()
        .then(token => {
          return saveTokenToDatabase(token);
        });
      await notifee.requestPermission();
    })();
  });
  return (
    <Gradient colors={['#D5FFEE', '#FCEFE9']}>
      <Screen
        buttonShadow={false}
        useDefault={false}
        useAlignment
        buttonLabel="Got it">
        <Box flex={1} justifyContent="center" alignItems="center" gap="n">
          <Text
            textAlign="center"
            color="primary"
            variant="mBold"
            fontSize={moderateScale(42)}>
            Verification Underway
          </Text>
          <Text color="formLabel" textAlign="center" variant="regular">
            {`Hey ${
              fullName.split(' ')[0]
            } 🎉, your documents and profile are currently being reviewed. We will notify you once the verification process is complete.`}
          </Text>
        </Box>
      </Screen>
    </Gradient>
  );
};
