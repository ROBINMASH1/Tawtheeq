const User = require("../models/users.model");
const Student = require("../models/students.model");
const AuditLog = require("../models/auditLogs.model");
const OTP = require("../models/otps.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Certificate = require("../models/certificates.model");
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
    const { personalId, name } = req.body;


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

    const certificate = await Certificate.findOne({ personalId: trimmedId });

    if (certificate) {
      certificate.user = user._id;
      await certificate.save();
    }

    await AuditLog.create({
      actionType: "CREATE_STUDENT",
      performedBy: req.user ? req.user._id : null,
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

const requestActivationOTP = async (req, res) => {
  try {
    const { identifier, email, phone } = req.body;


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

const sendOTPForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;


    const studentProfile = await Student.findOne({ email });
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const user = await User.findOne({ profile: studentProfile._id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only students can go through the activation flow
    if (user.roleModel !== "Student") {
      return res
        .status(400)
        .json({ error: "Only student accounts can be activated" });
    }

    // Generate and send a 6-digit OTP.
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await OTP.findOneAndDelete({ identifier: user.identifier }); // clear any old OTP
    await OTP.create({ identifier: user.identifier, otp });

    // Send OTP via email
    await sendOTPEmail(studentProfile.email, otp);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to reset your password.",
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const OTP_MAX_ATTEMPTS = 3;

/**
 * Shared logic for verifying OTP and updating user password.
 * Blocks activation/password reset temporarily after too many failed attempts.
 */
const _performOTPVerification = async (user, otp, newPassword) => {
  // Block if too many OTP failures
  if (user.isLocked && user.lockedUntil && user.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 1000 / 60);
    return {
      status: 403,
      error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).`,
    };
  }

  const otpRecord = await OTP.findOne({ identifier: user.identifier });
  if (!otpRecord) {
    return {
      status: 400,
      error: "OTP expired or not found. Please request a new one.",
    };
  }

  if (otpRecord.otp !== otp) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= OTP_MAX_ATTEMPTS) {
      user.isLocked = true;
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    }
    await user.save();
    const remaining = OTP_MAX_ATTEMPTS - user.failedLoginAttempts;
    return {
      status: 400,
      error: `Invalid OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "Account temporarily blocked."}`,
    };
  }

  // Check if the new password is the same as the old password
  const isMatch = await bcrypt.compare(newPassword, user.passwordHash);
  if (isMatch) {
    return {
      status: 400,
      error: "New password cannot be the same as the old password",
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordHash = passwordHash;
  user.failedLoginAttempts = 0;
  user.isLocked = false;
  user.lockedUntil = undefined;
  await user.save();

  // Clean up the OTP record
  await OTP.findOneAndDelete({ identifier: user.identifier });

  return { success: true };
};

//Verifies OTP, marks account as active, returns JWT token.

const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, email, phone, newPassword } = req.body;


    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const verification = await _performOTPVerification(user, otp, newPassword);
    if (!verification.success) {
      return res.status(verification.status).json({ error: verification.error });
    }

    // Update Student profile: set phone and mark as active
    if (user.roleModel === "Student") {
      await Student.findByIdAndUpdate(user.profile, {
        isActive: true,
        email: email,
        phone: phone,
      });
    }

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



const verifyOTPForgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;


    const studentProfile = await Student.findOne({ email });
    if (!studentProfile) {
      return res.status(404).json({ error: "Student not found" });
    }

    const user = await User.findOne({ profile: studentProfile._id });
    if (!user) {
      return res.status(404).json({ error: "Student not found" });
    }

    const verification = await _performOTPVerification(user, otp, newPassword);
    if (!verification.success) {
      return res.status(verification.status).json({ error: verification.error });
    }

    return res.status(200).json({
      message: "Password reset successfully.",
    });
  } catch (err) {
    console.error("Verify OTP Forgot Password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const requestChangeEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user._id;


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const emailTaken = await Student.findOne({
      email,
      _id: { $ne: user.profile },
    });
    if (emailTaken) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    // Generate and send a 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await OTP.findOneAndDelete({ identifier: user.identifier }); // clear old OTP
    await OTP.create({ identifier: user.identifier, otp });

    // Send OTP to the new email to verify ownership
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent to your new email. Please verify to complete the change.",
    });
  } catch (err) {
    console.error("Request change email OTP error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const changeEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userId = req.user._id;


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const studentProfile = await Student.findById(user.profile);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const emailTaken = await Student.findOne({
      email,
      _id: { $ne: user.profile },
    });
    if (emailTaken) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ identifier: user.identifier });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    studentProfile.email = email;
    await studentProfile.save();

    // Clean up OTP record
    await OTP.findOneAndDelete({ identifier: user.identifier });

    return res.status(200).json({ message: "Email changed successfully." });
  } catch (err) {
    console.error("Change email error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const changePhoneNumber = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user._id;


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const studentProfile = await Student.findById(user.profile);
    if (!studentProfile) {
      return res.status(404).json({ error: "Student profile not found" });
    }

    const phoneTaken = await Student.findOne({
      phone,
      _id: { $ne: user.profile },
    });
    if (phoneTaken) {
      return res.status(409).json({ error: "Phone number is already in use" });
    }

    studentProfile.phone = phone;
    await studentProfile.save();

    return res.status(200).json({ message: "Phone number changed successfully." });
  } catch (err) {
    console.error("Change phone number error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { createStudent, requestActivationOTP, verifyOTP, sendOTPForgotPassword, verifyOTPForgotPassword, requestChangeEmailOTP, changeEmail, changePhoneNumber };
