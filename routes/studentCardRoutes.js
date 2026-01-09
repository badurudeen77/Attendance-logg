const express = require("express");
const router = express.Router();
const studentCardController = require("../controllers/studentCardController");

router.post("/issue", studentCardController.issueCard);
router.get("/:studentId", studentCardController.getCardByStudentId);
router.patch("/status/:studentId", studentCardController.updateCardStatus);

module.exports = router;
