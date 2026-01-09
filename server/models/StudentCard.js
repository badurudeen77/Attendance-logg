const mongoose = require("mongoose");

const studentCardSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  cardId: {
    type: String,
    required: true,
    unique: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Lost"],
    default: "Active",
  },
});

module.exports = mongoose.model("StudentCard", studentCardSchema);
