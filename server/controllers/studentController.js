const Student = require("../models/Student");

// ===============================
// REGISTER STUDENT
// ===============================
exports.registerStudent = async (req, res) => {
  try {
    const { studentId, name, email, department, year, course } = req.body;

    if (!name || !department || !year) {
      return res.status(400).json({
        message: "Name, Department, and Year are required",
      });
    }

    // Auto-generate studentId and email if not provided to match simplified form
    const finalStudentId = studentId || `STU${Date.now()}`;
    const finalEmail = email || `${finalStudentId.toLowerCase()}@example.com`;
    const finalCourse = course || "General";

    const existingStudent = await Student.findOne({ $or: [{ studentId: finalStudentId }, { email: finalEmail }] });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student with this ID or Email already exists",
      });
    }

    const student = new Student({
      studentId: finalStudentId,
      name,
      email: finalEmail,
      department,
      year,
      course: finalCourse,
    });

    await student.save();

    res.status(201).json({
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    console.error("Error in registerStudent:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// GET ALL STUDENTS
// ===============================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// UPDATE STUDENT
// ===============================
exports.updateStudent = async (req, res) => {
  try {
    const { name, department, year, course, email } = req.body;
    const { id } = req.params;

    if (!name || !department || !year) {
      return res.status(400).json({
        message: "Name, Department, and Year are required",
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, department, year, course, email },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error in updateStudent:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// GET STUDENT BY ID
// ===============================
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
