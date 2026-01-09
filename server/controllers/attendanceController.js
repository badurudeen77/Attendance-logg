const Attendance = require("../models/Attendance");

// ===============================
// ADD ATTENDANCE
// ===============================
exports.addAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    // validation
    if (!studentId || !date || !status) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // prevent duplicate entry for same date
    const existing = await Attendance.findOne({
      studentId,
      date: new Date(date),
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for this date",
      });
    }

    const attendance = new Attendance({
      studentId,
      date,
      status,
    });

    await attendance.save();

    res.status(201).json({
      message: "Attendance added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// MONTH-WISE ATTENDANCE
// ===============================
exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, month, year } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await Attendance.find({
      studentId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const totalDays = records.length;
    const presentDays = records.filter(
      (r) => r.status === "Present"
    ).length;

    const percentage =
      totalDays === 0
        ? 0
        : ((presentDays / totalDays) * 100).toFixed(2);

    res.status(200).json({
      studentId,
      month,
      year,
      totalDays,
      presentDays,
      percentage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// GET ATTENDANCE BY DATE
// ===============================
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const records = await Attendance.find({
      date: {
        $gte: searchDate,
        $lt: nextDate,
      },
    }).populate("studentId");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// GET ALL ATTENDANCE FOR A MONTH
// ===============================
exports.getAllMonthlyAttendance = async (req, res) => {
  try {
    const { month, year } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("studentId");

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
