const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    examDate: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "10:00 AM"
    duration: { type: Number, required: true }, // in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
