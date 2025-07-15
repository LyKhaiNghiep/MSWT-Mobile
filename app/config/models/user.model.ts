// Define possible user status values
export type UserStatus =
  | 'Hoạt động'
  | 'Không hoạt động'
  | 'Tạm ngưng'
  | 'Đang trống lịch';

// Define possible role IDs
export type UserRole = 'admin' | 'user' | 'doctor';

// Define the user data interface
export interface UserData {
  userId: string;
  userName: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: UserStatus;
  image: string;
  roleId: string;
  createAt: string; // Changed from createdAt to createAt
  roleName: string; // New field
  description: string; // New field
  rating: number | null; // New field
  reasonForLeave: string | null; // New field
  // Keep these for backward compatibility
  role?: string;
  position?: string;
}

export type User = {
  userId: string;
  userName: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  status: UserStatus;
  image: string;
  roleId: string;
  createAt: string; // Changed from createdAt to createAt
  roleName: string; // New field
  description: string; // New field
  rating: number | null; // New field
  reasonForLeave: string | null; // New field
  // Keep these for backward compatibility
  role?: any;
  position?: string;
};
