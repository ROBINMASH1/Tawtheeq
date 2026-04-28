const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional - user claims certificate after registering
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
    },
    studentId: { type: String, required: true }, // this the student id at the university
    personalId: { type: String, required: true }, // This is personalIdentifier
    ipfsHash: { type: String, required: true },
    blockchainTxHash: { type: String },
    status: {
      type: String,
      enum: ["verified", "revoked"],
      default: "verified",
    },
    degree: { type: String, required: true },
    major: { type: String, required: true },
    gpa: { type: Number, required: true },
    graduationDate: { type: Date, required: true },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Certificate", certificateSchema);
