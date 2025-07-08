import {useIsFocused} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useAuth} from '../contexts/AuthContext';
import {Login} from '../screens';
import {isAndroid} from '../utils';
import {AppStackParamList} from './AppStackParamList';
import {Navigator} from './Navigator';
import Report from '../screens/Report';
import Trash from '../screens/Trash';
import User from '../screens/User';
import Restroom from '../screens/Restroom';
import Floor from '../screens/Floor';

export const AppStack = () => {
  const Stack = createNativeStackNavigator<AppStackParamList>();
  const {user} = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      SplashScreen.hide();
    }
  }, [isFocused]);

  // eslint-disable-next-line curly
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: isAndroid ? 'none' : 'ios',
      }}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={Navigator} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="Trash" component={Trash} />
          <Stack.Screen name="Floor" component={Floor} />
          <Stack.Screen name="Restroom" component={Restroom} />
          <Stack.Screen name="User" component={User} />
          {/* <Stack.Group
            screenOptions={{
              presentation: 'containedModal',
            }}>
            <Stack.Screen name="CustomDateRange" component={CustomDateRange} />
          </Stack.Group> */}
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};
