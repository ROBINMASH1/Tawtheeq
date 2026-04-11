const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    ipfsHash: { type: String, required: true },
    blockchainTxHash: { type: String },
    status: {
      type: String,
      enum: ["verified", "revoked"],
      default: "verified",
    },
    degree: { type: String, required: true },
    gpa: { type: Number, required: true },
    graduationDate: { type: Date, required: true },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Certificate", certificateSchema);
