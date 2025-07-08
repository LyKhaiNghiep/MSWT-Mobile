import {NavigationProp} from '@react-navigation/native';

export type AppStackParamList = {
  Login: undefined;
  Verification: undefined;
  VerificationStatus: undefined;
  CustomDateRange: undefined;
  Tabs: undefined;
  Report: undefined;
  Trash: undefined;
  Floor: undefined;
  Restroom: undefined;
  User: undefined;
};
export type StackNavigation = NavigationProp<AppStackParamList>;
