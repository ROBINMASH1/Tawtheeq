const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actionType: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
