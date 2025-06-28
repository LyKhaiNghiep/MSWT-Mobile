import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';

import {useIsFocused} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {localStore} from '../data';
import {
  CustomDateRange,
  ManageAppointment,
  Login,
  Verification,
  VerificationStatus,
} from '../screens';
import {Capture} from '../screens/Capture';
import {isAndroid, isEmpty} from '../utils';
import {AppStackParamList} from './AppStackParamList';
import {HomeNavigator} from './HomeNavigator';
export const AppStack = () => {
  const Stack = createNativeStackNavigator<AppStackParamList>();

  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const isFocused = useIsFocused();
  const [initializing, setInitializing] = useState(true);
  const {
    addFullName,
    addEmail,
    verificationStatus,
    fullName: storeFullName,
    email: storeEmail,
    addUID,
  } = localStore();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(users => {
      setUser(users!);
      if (isEmpty(storeEmail) && isEmpty(storeFullName)) {
        addEmail(users?.email!);
        addFullName(users?.displayName!);
        addUID(auth()?.currentUser?.uid!);
      }

      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFocused) {
      SplashScreen.hide();
    }
  }, [isFocused]);

  // eslint-disable-next-line curly
  if (initializing) return <></>;
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: isAndroid ? 'none' : 'ios',
      }}>
      {user ? (
        <>
          {verificationStatus === 'pending' ? (
            <Stack.Screen
              name="VerificationStatus"
              component={VerificationStatus}
            />
          ) : verificationStatus === 'not_started' ? (
            <>
              <Stack.Screen
                name="Verification"
                component={Verification}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="Capture" component={Capture} />
            </>
          ) : verificationStatus === 'verified' ? (
            <>
              <Stack.Screen name="HomeTab" component={HomeNavigator} />
              <Stack.Screen name="Messages" component={HomeNavigator} />
              <Stack.Screen name="VideoCall" component={HomeNavigator} />
              <Stack.Screen
                name="ManageAppointment"
                component={ManageAppointment}
              />
              <Stack.Group
                screenOptions={{
                  presentation: 'containedModal',
                }}>
                <Stack.Screen
                  name="CustomDateRange"
                  component={CustomDateRange}
                />
              </Stack.Group>
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
            </>
          )}
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
        </>
      )}
    </Stack.Navigator>
  );
};
