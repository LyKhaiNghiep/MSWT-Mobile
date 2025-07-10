import {useIsFocused} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useAuth} from '../contexts/AuthContext';
import {Login} from '../screens';
import {isAndroid} from '../utils';
import {AppStackParamList} from './AppStackParamList';
import {Navigator} from './Navigator';
import Trash from '../screens/Trash';
import User from '../screens/User';
import Restroom from '../screens/Restroom';
import Floor from '../screens/Floor';
import ReportPage from '../screens/Report';
import ReportDetails from '../screens/ReportDetails';
import TrashBinDetails from '../screens/TrashDetails';
import FloorDetails from '../screens/FloorDetails';
import RestroomDetails from '../screens/RestroomDetails';
import UserDetails from '../screens/UserDetails';
import WorkerReportPage from '../screens/WorkerReport';
import WorkerReportDetails from '../screens/WorkerReportDetails';

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
      initialRouteName={user ? 'Home' : 'Login'}
      screenOptions={{
        headerShown: false,
        animation: isAndroid ? 'none' : 'ios',
      }}>
      {user ? (
        <Stack.Group screenOptions={{presentation: 'card'}}>
          <Stack.Screen name="Tabs" component={Navigator} />
          <Stack.Screen
            name="Report"
            component={ReportPage}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="ReportDetails"
            component={ReportDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Trash"
            component={Trash}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="TrashDetails"
            component={TrashBinDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Floor"
            component={Floor}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="FloorDetails"
            component={FloorDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Restroom"
            component={Restroom}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="RestroomDetails"
            component={RestroomDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="User"
            component={User}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="WorkerReport"
            component={WorkerReportPage}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="WorkerReportDetails"
            component={WorkerReportDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};
