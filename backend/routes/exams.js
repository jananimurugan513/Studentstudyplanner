const router = require("express").Router();
const Exam = require("../models/Exam");
const { verifyToken } = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newExam = new Exam({ ...req.body, userId: req.user.id });
  try {
    const savedExam = await newExam.save();
    res.status(201).json(savedExam);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedExam);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.status(200).json("Exam has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL FOR USER
router.get("/", verifyToken, async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user.id }).sort({ examDate: 1 });
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
