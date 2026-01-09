const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.post("/register", studentController.registerStudent);
router.get("/", studentController.getAllStudents);
router.put("/:id", studentController.updateStudent);
router.get("/:studentId", studentController.getStudentById);

module.exports = router;
