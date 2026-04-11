const mongoose = require("mongoose");

const moheAdminSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model("MoheAdmin", moheAdminSchema);
