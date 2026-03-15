const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    teacher: { type: String },
    creditHours: { type: Number, default: 3 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", SubjectSchema);
