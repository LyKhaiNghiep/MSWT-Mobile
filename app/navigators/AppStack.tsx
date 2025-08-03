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
import CreateWorkerReport from '../screens/CreateWorkerReport';
import LeaveRequestDetails from '../screens/LeaveRequestDetails';
import LeaveRequest from '../screens/LeaveRequest';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import Calendar from '../screens/Calendar';
import CalendarSupervisor from '../screens/CalendarSupervisor';
import CreateLeaveRequest from '../screens/CreateLeaveRequest';
import Employees from '../screens/Employee';
import SensorPage from '../screens/Sensor';
import SensorDetailsPage from '../screens/SensorDetails';
import AreaPage from '../screens/Area';
import AreaDetailsPage from '../screens/AreaDetails';
import NotificationDetails from '../screens/NotificationDetails';
import CreateReport from '../screens/CreateReport';
import Request from '../screens/Request';
import CreateRequest from '../screens/CreateRequest';
import RequestDetails from '../screens/RequestDetails';
import MyCalendar from '../screens/Calendar';
import CheckInOutPage from '../screens/CheckInOut';

export const AppStack = () => {
  const Stack = createNativeStackNavigator<AppStackParamList>();
  const {user} = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      SplashScreen.hide();
    }
  }, [isFocused]);

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
            name="CheckInOut"
            component={CheckInOutPage}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="CreateReport"
            component={CreateReport}
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
            name="Employees"
            component={Employees}
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
            name="CreateLeaveRequest"
            component={CreateLeaveRequest}
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

          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="Calendar"
            component={MyCalendar}
            options={{
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="CalendarSupervisor"
            component={CalendarSupervisor}
            options={{
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="LeaveRequest"
            component={LeaveRequest}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="LeaveDetails"
            component={LeaveRequestDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="CreateWorkerReport"
            component={CreateWorkerReport}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Sensor"
            component={SensorPage}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="SensorDetails"
            component={SensorDetailsPage}
            options={{
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name="Area"
            component={AreaPage}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="AreaDetails"
            component={AreaDetailsPage}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="NotificationDetails"
            component={NotificationDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Request"
            component={Request}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="CreateRequest"
            component={CreateRequest}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="RequestDetails"
            component={RequestDetails}
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
