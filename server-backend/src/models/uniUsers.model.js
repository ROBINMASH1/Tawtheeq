const mongoose = require("mongoose");

const uniUserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["Uniadmin", "UniStaff"],
      default: "UniStaff",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("uniUser", uniUserSchema);
