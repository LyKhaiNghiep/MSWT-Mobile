import {NavigationProp} from '@react-navigation/native';

export type AppStackParamList = {
  Login: undefined;
  Verification: undefined;
  VerificationStatus: undefined;
  ManageAppointment: undefined;
  CustomDateRange: undefined;
  HomeTab: undefined;
  VideoCall: {
    incomingCall: boolean;
    patientName: string;
    patientID: string;
    offer?: any;
    avatar?: string;
  };
  Messages: {patientID: string; channelName: string; channelSelfie: string};
  Capture: {type: 'SELFIE' | 'ID'};
};
export type StackNavigation = NavigationProp<AppStackParamList>;
