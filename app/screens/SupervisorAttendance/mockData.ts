// Mock data for testing SupervisorAttendance screen
export const mockEmployeesData = [
  {
    userId: "US001",
    fullName: "Nguyễn Văn An",
    image: "https://i.pinimg.com/736x/65/d6/c4/65d6c4b0cc9e85a631cf2905a881b7f0.jpg",
    email: "nguyen.van.an@company.com",
    phone: "0123456789",
    position: "Nhân viên vệ sinh",
    role: "Worker",
    status: "Hoạt động",
    checkInTime: "2025-01-21T08:00:00Z",
    checkOutTime: "2025-01-21T17:00:00Z",
    attendanceStatus: "Present",
    attendanceDate: "2025-01-21"
  },
  {
    userId: "US002",
    fullName: "Trần Thị Bình",
    image: null, // Test case with no image
    email: "tran.thi.binh@company.com",
    phone: "0987654321",
    position: "Nhân viên vệ sinh",
    role: "Worker",
    status: "Hoạt động",
    checkInTime: "2025-01-21T08:15:00Z", 
    checkOutTime: null, // Test case with no check out
    attendanceStatus: "Late",
    attendanceDate: "2025-01-21"
  },
  {
    userId: "US003",
    fullName: "Lê Văn Cường",
    image: "https://example.com/invalid-image.jpg", // Test invalid image
    email: "le.van.cuong@company.com",
    phone: "0111222333",
    position: "Nhân viên vệ sinh",
    role: "Worker", 
    status: "Hoạt động",
    checkInTime: null, // Test case with no check in
    checkOutTime: null,
    attendanceStatus: "Not Checked In",
    attendanceDate: "2025-01-21"
  },
  {
    userId: "US004",
    fullName: "Phạm Thị Dung",
    email: "pham.thi.dung@company.com",
    phone: "0444555666",
    position: "Nhân viên vệ sinh",
    role: "Worker",
    status: "Hoạt động",
    // Missing checkInTime, checkOutTime fields
    attendanceStatus: "Absent",
    attendanceDate: "2025-01-21"
  },
  {
    userId: "US005",
    fullName: "", // Test empty name
    email: "",   // Test empty email
    phone: "",   // Test empty phone
    position: "", // Test empty position
    role: "Worker",
    status: "Hoạt động",
    attendanceStatus: undefined, // Test undefined status
    attendanceDate: "2025-01-21"
  }
];
