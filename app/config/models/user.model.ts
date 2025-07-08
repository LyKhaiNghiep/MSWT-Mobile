// Define possible user status values
export type UserStatus = 'Hoạt động' | 'Không hoạt động' | 'Tạm ngưng';

// Define possible role IDs
export type UserRole = 'admin' | 'user' | 'doctor';

// Define the user data interface
export interface UserData {
  userId: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: UserStatus;
  image: string;
  roleId: string;
  createdAt: string;
  role: 'Manager' | 'Worker' | 'Supervisor';
  position: string;
}
