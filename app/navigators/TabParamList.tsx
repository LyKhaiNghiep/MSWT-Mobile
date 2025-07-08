import {NavigationProp} from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Notification: undefined;
  Profile: undefined;
};
export type StackTabNavigation = NavigationProp<TabParamList>;
