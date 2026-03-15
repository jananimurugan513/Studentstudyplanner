const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    studentId: { type: String },
    studentClass: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studyPreferences: {
      availableHours: { type: Number, default: 2 },
      preferredSlots: { type: String, default: "Evening" },
      dailyGoals: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
