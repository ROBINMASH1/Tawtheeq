const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    orgId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    address: { type: String },
    contactEmail: { type: String, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("University", universitySchema);
