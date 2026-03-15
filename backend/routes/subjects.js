const router = require("express").Router();
const Subject = require("../models/Subject");
const { verifyToken } = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newSubject = new Subject({ ...req.body, userId: req.user.id });
  try {
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json("Subject has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL FOR USER
router.get("/", verifyToken, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
