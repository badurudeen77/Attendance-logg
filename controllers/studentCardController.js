const StudentCard = require("../models/StudentCard");

// ===============================
// ISSUE STUDENT CARD
// ===============================
exports.issueCard = async (req, res) => {
  try {
    const { studentId, cardId, expiryDate } = req.body;

    if (!studentId || !cardId || !expiryDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingCard = await StudentCard.findOne({ $or: [{ studentId }, { cardId }] });
    if (existingCard) {
      return res.status(400).json({
        message: "Card for this Student or with this Card ID already exists",
      });
    }

    const card = new StudentCard({
      studentId,
      cardId,
      expiryDate,
    });

    await card.save();

    res.status(201).json({
      message: "Student Card issued successfully",
      card,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// GET CARD BY STUDENT ID
// ===============================
exports.getCardByStudentId = async (req, res) => {
  try {
    const card = await StudentCard.findOne({ studentId: req.params.studentId });
    if (!card) {
      return res.status(404).json({
        message: "Student Card not found",
      });
    }
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// UPDATE CARD STATUS
// ===============================
exports.updateCardStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const card = await StudentCard.findOneAndUpdate(
      { studentId: req.params.studentId },
      { status },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({
        message: "Student Card not found",
      });
    }

    res.status(200).json({
      message: "Card status updated successfully",
      card,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
