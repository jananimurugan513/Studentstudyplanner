const router = require("express").Router();
const Task = require("../models/Task");
const { verifyToken } = require("../middleware/verifyToken");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newTask = new Task({ ...req.body, userId: req.user.id });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json("Task has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL FOR USER
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
