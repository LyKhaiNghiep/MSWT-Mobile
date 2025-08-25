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
// Removed: Restroom import - rooms are now displayed within Area details
import Area from '../screens/Area';
import ReportPage from '../screens/Report';
import ReportDetails from '../screens/ReportDetails';
import TrashBinDetails from '../screens/TrashDetails';
import AreaDetails from '../screens/AreaDetails';
// Removed: RestroomDetails import - rooms are now displayed within Area details
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
import CreateSupervisorLeaveRequest from '../screens/CreateSupervisorLeaveRequest';
import Employees from '../screens/Employee';
import SensorPage from '../screens/Sensor';
import SensorDetailsPage from '../screens/SensorDetails';
// Renamed: Floor and FloorDetails folders to Area and AreaDetails to reflect their actual purpose
import NotificationDetails from '../screens/NotificationDetails';
import CreateReport from '../screens/CreateReport';
import Request from '../screens/Request';
import CreateRequest from '../screens/CreateRequest';
import RequestDetails from '../screens/RequestDetails';
import MyCalendar from '../screens/Calendar';
import CheckInOutPage from '../screens/CheckInOut';
import {useNotificationSetup} from '../services/notification';
import WorkerDashboard from '../screens/WorkerDashboard';
import ForgotPassword from '../screens/ForgotPassword';
import SupervisorReport from '../screens/SupervisorReport/index';
import CreateSupervisorReport from '../screens/CreateSupervisorReport/index';
import SupervisorReportDetails from '../screens/SupervisorReportDetails/index';

export const AppStack = () => {
  useNotificationSetup();

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
            name="WorkerDashboard"
            component={WorkerDashboard}
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
            component={Area}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="FloorDetails"
            component={AreaDetails}
            options={{
              animation: 'slide_from_right',
            }}
          />
          {/* Removed: Restroom and RestroomDetails screens - rooms are now displayed within Area details */}
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
            name="CreateSupervisorLeaveRequest"
            component={CreateSupervisorLeaveRequest}
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
            name="SupervisorReport"
            component={SupervisorReport}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="CreateSupervisorReport"
            component={CreateSupervisorReport}
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="SupervisorReportDetails"
            component={SupervisorReportDetails}
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

          {/* Using Floor and FloorDetails route names for backward compatibility */}
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
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
