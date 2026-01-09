const express = require("express");
const cors = require("cors");

const attendanceRoutes = require("./routes/attendanceRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentCardRoutes = require("./routes/studentCardRoutes");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Base route (test)
app.get("/", (req, res) => {
  res.send("Attendance Logger Backend is running");
});

// Mock login route for frontend authentication
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  // Simple check for demo purposes
  if (email && password) {
    res.status(200).json({
      message: "Login successful",
      token: "logged-in",
      user: { email }
    });
  } else {
    res.status(400).json({ message: "Email and password required" });
  }
});

// Attendance routes
app.use("/api/attendance", attendanceRoutes);

// Student routes
app.use("/api/students", studentRoutes);

// Student Card routes
app.use("/api/student-cards", studentCardRoutes);

module.exports = app;
