const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    subject: { type: String },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    duration: { type: Number, default: 60 }, // duration in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
