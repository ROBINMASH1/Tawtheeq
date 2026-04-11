const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true }, // Username or Personal ID
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    email: { type: String, unique: true },
    roleModel: {
      type: String,
      required: true,
      enum: ["Student", "MOHEAdmin", "uniUser"],
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleModel",
      required: true,
    },
    isLocked: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
