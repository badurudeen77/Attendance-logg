const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
    default: "1st Year",
  },
  course: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
