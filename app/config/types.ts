import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {TabParamList} from '../navigators/TabParamList';
import {AppStackParamList} from '../navigators';

export interface IResponse {
  success: boolean;
  error?: string;
}
export interface IResponseWithData<T> extends IResponse {
  success: boolean;
  data: T;
  error?: string;
}

export type NavigationTabProps = NativeStackNavigationProp<TabParamList>;
export type NavigationScreenProps =
  NativeStackNavigationProp<AppStackParamList>;

export type MenuItem = {
  id: string;
  title: string;
  icon: string;
  route: ScreenName;
  color: string;
};

export type ScreenName =
  | 'Report'
  | 'Trash'
  | 'Floor'
  | 'Restroom'
  | 'User'
  | 'Home'
  | 'ReportDetails'
  | 'LeaveRequest'
  | 'Calendar'
  | 'WorkerReport'
  | 'Employees';
