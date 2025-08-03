// Base API URL for the backend
export const BASE_API_URL =
  'https://capstoneproject-mswt-su25.onrender.com/api';

export const API_URLS = {
  // User management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong userService.js
  // Backend xử lý authentication trực tiếp trong login endpoint
  USER: {
    GET_ALL: `users`,
    GET_BY_ID: (id: string) => `users/${id}`,
    CREATE: `users`,
    UPDATE: (id: string) => `users/${id}`,
    UPDATE_STATUS: (id: string) => `users/update-status/${id}`,
    DELETE: (id: string) => `users/${id}`,
    LOGIN: `users/login`, // Backend xử lý login và trả về token
    REGISTER: `users/register`, // Backend xử lý register
    CHANGE_PASSWORD: `users/change-password`, // Backend xử lý change password
    UPDATE_PROFILE: `users/update-profile`, // Backend xử lý change password
  },

  // Floor management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useFloor.ts
  FLOOR: {
    GET_ALL: `floors`,
    GET_BY_ID: (id: string) => `floors/${id}`,
    CREATE: `floors`,
    UPDATE: (id: string) => `floors/${id}`,
    DELETE: (id: string) => `floors/${id}`,
  },

  TRASH_BIN: {
    GET_ALL: `trashbins`,
    GET_BY_ID: (id: string) => `trashbins/${id}`,
    CREATE: `trashbins`,
    UPDATE: (id: string) => `trashbins/${id}`,
    DELETE: (id: string) => `trashbins/${id}`,
  },
  ALERT: {
    GET_ALL: `alerts`,
    GET_BY_ID: (id: string) => `alerts/${id}`,
    CREATE: `alerts`,
    UPDATE: (id: string) => `alerts/${id}`,
    DELETE: (id: string) => `alerts/${id}`,
  },

  // Area management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useArea.ts
  AREA: {
    GET_ALL: `areas`,
    GET_BY_ID: (id: string) => `areas/${id}`,
    CREATE: `areas`,
    UPDATE: (id: string) => `areas/${id}`,
    DELETE: (id: string) => `areas/${id}`,
  },

  CLOUDINARY: `Cloudinary/upload`,

  // Area management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useArea.ts
  CHECK_IN_OUT: {
    GET_ALL: `attendanceRecord/all`,
    MY: `attendanceRecord/my-records`,
    CHECK_IN: `attendanceRecord/checkin`,
    CHECK_OUT: `attendanceRecord/checkout`,
  },

  // Shift management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong shifts.ts
  SHIFT: {
    GET_ALL: `shifts`,
    GET_BY_ID: (id: string) => `shifts/${id}`,
    CREATE: `shifts`,
    UPDATE: (id: string) => `shifts/${id}`,
    DELETE: (id: string) => `shifts/${id}`,
  },

  // Restroom management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useRestroom.ts
  RESTROOM: {
    GET_ALL: `restrooms`,
    GET_BY_ID: (id: string) => `restrooms/${id}`,
    CREATE: `restrooms`,
    UPDATE: (id: string) => `restrooms/${id}`,
    DELETE: (id: string) => `restrooms/${id}`,
  },

  // Schedule management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong useRestroom.ts
  SCHEDULE: {
    GET_ALL: `schedules`,
    GET_BY_ID: (id: string) => `schedules/${id}`,
    CREATE: `schedules`,
    UPDATE: (id: string) => `schedules/${id}`,
    DELETE: (id: string) => `schedules/${id}`,
  },

  // Schedule Details management endpoints
  SCHEDULE_DETAILS: {
    GET_ALL: `scheduledetails`,
    GET_BY_USER_ID: (id: string) => `scheduledetails/user/${id}`,
    GET_BY_ID: (id: string) => `scheduledetails/${id}`,
    GET_BY_SCHEDULE_ID: (scheduleId: string) =>
      `scheduledetails/schedule/${scheduleId}`,
    CREATE: `scheduledetails`,
    CREATE_FOR_SCHEDULE: (scheduleId: string) =>
      `scheduledetails/${scheduleId}/details`,
    UPDATE: (id: string) => `scheduledetails/${id}`,
    DELETE: (id: string) => `scheduledetails/${id}`,
    RATE: (id: string) => `scheduledetails/scheduledetails/rating/${id}`,
  },

  // Shifts management endpoints
  SHIFTS: {
    GET_ALL: `shifts`,
    GET_BY_ID: (id: string) => `shifts/${id}`,
    CREATE: `shifts`,
    UPDATE: (id: string) => `shifts/${id}`,
    DELETE: (id: string) => `shifts/${id}`,
  },

  // Assignments management endpoints
  ASSIGNMENTS: {
    GET_ALL: `assignments`, // Correct plural form from Swagger
    GET_BY_ID: (id: string) => `assignments/${id}`,
    CREATE: `assignments`,
    UPDATE: (id: string) => `assignments/${id}`,
    DELETE: (id: string) => `assignments/${id}`,
  },
  LEAVE_REQUEST: {
    GET_ALL: `leaves`,
    MY_LEAVES: `leaves/my-leaves`,
    GET_BY_ID: (id: string) => `leaves/${id}`,
    CREATE: `leaves`,
    UPDATE: (id: string) => `leaves/${id}`,
    DELETE: (id: string) => `leaves/${id}`,
  },
  REQUEST: {
    GET_ALL: `request`,
    GET_BY_ID: (id: string) => `request/${id}`,
    CREATE: `request`,
    UPDATE: (id: string) => `request/${id}`,
    DELETE: (id: string) => `request/${id}`,
  },

  // TrashBin management endpoints
  SENSOR: {
    GET_ALL: `sensors`,
    GET_BY_ID: (id: string) => `sensors/${id}`,
    CREATE: `sensors`,
    UPDATE: (id: string) => `sensors/${id}`,
    DELETE: (id: string) => `sensors/${id}`,
  },
  // TrashBin management endpoints
  TRASHBIN: {
    GET_ALL: `trashbins`,
    GET_ALL_WITH_SENSORS: `trashbins/with-sensors`,
    GET_BY_ID: (id: string) => `trashbins/${id}`,
    CREATE: `trashbins`,
    UPDATE: (id: string) => `trashbins/${id}`,
    DELETE: (id: string) => `trashbins/${id}`,
  },

  // Report management endpoints - ĐANG ĐƯỢC SỬ DỤNG trong ReportManagement.jsx
  REPORT: {
    GET_ALL: `reports`, // GET /api/reports - Báo cáo tổng
    GET_WITH_ROLE: `reports/with-role`, // GET /api/reports/with-role - Filter theo role
    GET_WITH_LEADER_ROLE: `reports/with-leader-role`, // GET /api/reports/with-leader-role - Reports for manager
    GET_BY_ID: (id: string) => `reports/${id}`,
    CREATE: `reports`,
    CREATE_LEADER: `reports/leader`, // POST /api/reports/leader - Tạo báo cáo cho Leader
    UPDATE: (id: string) => `reports/${id}`,
    DELETE: (id: string) => `reports/${id}`,
  },

  // Alerts management endpoints
  ALERTS: {
    GET_ALL: `alerts`,
    GET_BY_ID: (id: string) => `alerts/${id}`,
    GET_BY_USER: (userId: string) => `alerts/user/${userId}`,
    CREATE: `alerts`,
    UPDATE: (id: string) => `alerts/${id}`,
    MARK_AS_READ: (id: string) => `alerts/${id}/read`,
    MARK_ALL_AS_READ: (userId: string) => `alerts/user/${userId}/read-all`,
    DELETE: (id: string) => `alerts/${id}`,
  },
};
