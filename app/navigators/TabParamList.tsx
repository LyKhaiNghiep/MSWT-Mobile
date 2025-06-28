import {NavigationProp} from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Appointment: undefined;
  Chat: undefined;
  Earning: undefined;
  Profile: undefined;
};
export type StackTabNavigation = NavigationProp<TabParamList>;
