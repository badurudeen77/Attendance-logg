import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attendance Services
export const attendanceService = {
  // Mark attendance (POST)
  markAttendance: async (attendanceData) => {
    try {
      // Matches: router.post("/add", addAttendance); in attendanceRoutes.js
      const response = await api.post('/attendance/add', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get month-wise attendance percentage (GET)
  getMonthlyStats: async (studentId, month, year) => {
    try {
      // Matches: router.get("/monthly/:studentId/:month/:year", getMonthlyAttendance); in attendanceRoutes.js
      const response = await api.get(`/attendance/monthly/${studentId}/${month}/${year}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get attendance by date (GET)
  getAttendanceByDate: async (date) => {
    try {
      // Matches: router.get("/date/:date", getAttendanceByDate); in attendanceRoutes.js
      const response = await api.get(`/attendance/date/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all attendance for a month (GET)
  getAllMonthlyAttendance: async (month, year) => {
    try {
      // Matches: router.get("/all-monthly/:month/:year", getAllMonthlyAttendance); in attendanceRoutes.js
      const response = await api.get(`/attendance/all-monthly/${month}/${year}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Student Services
export const studentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      // Matches: router.get("/", studentController.getAllStudents); in studentRoutes.js
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register a new student
  registerStudent: async (studentData) => {
    try {
      // Matches: router.post("/register", studentController.registerStudent); in studentRoutes.js
      const response = await api.post('/students/register', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update student details
  updateStudent: async (id, studentData) => {
    try {
      // Matches: router.put("/:id", studentController.updateStudent); in studentRoutes.js
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default api;
