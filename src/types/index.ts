// Common types for the app
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

// Screen params type
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
