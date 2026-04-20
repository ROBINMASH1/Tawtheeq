const mongoose = require("mongoose");

const moheAdminSchema = new mongoose.Schema(
  {
    EmployeeID: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MoheAdmin", moheAdminSchema);
