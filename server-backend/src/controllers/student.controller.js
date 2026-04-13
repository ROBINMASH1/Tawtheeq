const User = require("../models/users.model");
const Student = require("../models/students.model");
const AuditLog = require("../models/auditLogs.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const generateTempPassword = (length = 8) => {
  return crypto
    .randomBytes(Math.ceil(length * 1.5))
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
};

const createStudent = async (req, res) => {
  try {
    const { personalId, name, userId } = req.body;

    if (!personalId || !name) {
      return res
        .status(400)
        .json({ error: "Personal ID and name are required" });
    }

    const trimmedId = String(personalId).trim();
    const trimmedName = String(name).trim();

    const existingUser = await User.findOne({ identifier: trimmedId });
    if (existingUser) {
      return res.status(409).json({ error: "Student account already exists." });
    }

    const tempPassword = generateTempPassword(8);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const studentProfile = await Student.create({
      isActive: false,
    });

    const user = await User.create({
      identifier: trimmedId,
      name: trimmedName,
      passwordHash,
      roleModel: "Student",
      profile: studentProfile._id,
    });

    await AuditLog.create({
      actionType: "CREATE_STUDENT",
      performedBy: userId,
      details: `Created student account with personal ID: ${trimmedId}`,
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    return res.status(201).json({
      message: "Student account created successfully.",
      studentId: user._id,
      personalId: trimmedId,
      name: trimmedName,
      temporaryPassword: tempPassword, // Return temp password for student to use on first login
    });
  } catch (err) {
    console.error("Create student error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createStudent };
