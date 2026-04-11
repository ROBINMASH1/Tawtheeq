const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    phone: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
