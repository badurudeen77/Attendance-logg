const express = require("express");
const router = express.Router();

const {
  addAttendance,
  getMonthlyAttendance,
  getAttendanceByDate,
  getAllMonthlyAttendance
} = require("../controllers/attendanceController");

// Add attendance
router.post("/add", addAttendance);

// Get month-wise attendance report (single student)
router.get("/monthly/:studentId/:month/:year", getMonthlyAttendance);

// Get attendance by date (all students)
router.get("/date/:date", getAttendanceByDate);

// Get all attendance for a month (all students)
router.get("/all-monthly/:month/:year", getAllMonthlyAttendance);

module.exports = router;
