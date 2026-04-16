const User = require("../models/users.model");
const Student = require("../models/students.model");
const AuditLog = require("../models/auditLogs.model");
const OTP = require("../models/otps.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createToken, sendOTPEmail } = require("../utils/auth.helpers");

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
      details: `Created student account with personal ID: ${trimmedId} with temporary password: ${tempPassword}`,
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

const requestActivationOTP = async (req, res) => {
  try {
    const { identifier, email, phone } = req.body;

    if (!identifier || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only students can go through the activation flow
    if (user.roleModel !== "Student") {
      return res
        .status(400)
        .json({ error: "Only student accounts can be activated" });
    }

    const studentProfile = await Student.findById(user.profile);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    // Student.isActive defaults to false; once true the account is already activated
    if (studentProfile.isActive) {
      return res.status(400).json({ error: "Account is already activated" });
    }

    // Check for email uniqueness
    const emailTaken = await Student.findOne({
      email,
      _id: { $ne: user.profile },
    });

    if (emailTaken) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    // Check for phone uniqueness
    const phoneTaken = await Student.findOne({
      phone,
      _id: { $ne: user.profile },
    });
    if (phoneTaken) {
      return res.status(409).json({ error: "Phone number is already in use" });
    }

    // Generate and send a 6-digit OTP.
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await OTP.findOneAndDelete({ identifier }); // clear any old OTP
    await OTP.create({ identifier, otp });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete activation.",
    });
  } catch (err) {
    console.error("Activate account error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const OTP_MAX_ATTEMPTS = 3;

/**
 * Verifies OTP, marks account as active, returns JWT token.
 * Blocks activation temporarily after too many failed attempts.
 */

const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, email, phone, newPassword } = req.body;

    if (!identifier || !otp || !email || !phone || !newPassword) {
      return res.status(400).json({
        error:
          "Identifier, OTP, email, phone, and newPassword are all required",
      });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Block if too many OTP failures (reuse the login lock mechanism)
    if (user.isLocked && user.lockedUntil && user.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil - Date.now()) / 1000 / 60,
      );
      return res.status(403).json({
        error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const otpRecord = await OTP.findOne({ identifier });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ error: "OTP expired or not found. Please request a new one." });
    }

    if (otpRecord.otp !== otp) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= OTP_MAX_ATTEMPTS) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      }
      await user.save();
      const remaining = OTP_MAX_ATTEMPTS - user.failedLoginAttempts;
      return res.status(400).json({
        error: `Invalid OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Account temporarily blocked."}`,
      });
    }

    // OTP is correct apply the activation data sent from frontend
    const passwordHash = await bcrypt.hash(newPassword, 12);

    user.passwordHash = passwordHash;
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = undefined;
    await user.save();

    // Update Student profile: set phone and mark as active
    if (user.roleModel === "Student") {
      await Student.findByIdAndUpdate(user.profile, {
        isActive: true,
        email: email,
        phone: phone,
      });
    }

    // Clean up the OTP record
    await OTP.findOneAndDelete({ identifier });

    const token = await createToken(user);

    return res.status(200).json({
      message: "Account activated successfully.",
      token,
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createStudent, requestActivationOTP, verifyOTP };
