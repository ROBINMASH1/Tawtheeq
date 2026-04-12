const User = require("../models/users.model");
const Student = require("../models/students.model");
const UniUser = require("../models/uniUsers.model");
const OTP = require("../models/otps.model");
const bcrypt = require("bcrypt");
const {
  createToken,
  sendOTPEmail,
  checkStudentActivation,
} = require("../utils/auth.helpers");

/**
 * Works for all roles (Student, uniUser, MOHEAdmin).
 * Students who haven't activated yet are redirected to the activation flow.
 * Handles account locking after 5 consecutive failed attempts.
 */

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Identifier and password are required" });
    }
    console.log("Login payload:", req.body);
    const user = await User.findOne({ identifier });
    console.log("Found user:", user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Account lock check
    if (user.isLocked) {
      if (user.lockedUntil && user.lockedUntil > Date.now()) {
        const minutesLeft = Math.ceil(
          (user.lockedUntil - Date.now()) / 1000 / 60,
        );
        return res.status(403).json({
          error: `Account is locked. Try again in ${minutesLeft} minute(s).`,
        });
      }

      // Lock expired — reset
      user.isLocked = false;
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
      }
      await user.save();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Successful auth — reset failure counters
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = undefined;
    await user.save();

    // Role-specific check: students must activate before getting a token
    if (user.roleModel === "Student") {
      const needsActivation = await checkStudentActivation(user, res);
      if (needsActivation) return;
    }

    // For uniUsers, fetch the sub-role (Uniadmin / UniStaff) from the profile
    let subRole = null;
    if (user.roleModel === "uniUser") {
      const uniUserProfile = await UniUser.findById(user.profile);
      subRole = uniUserProfile?.role ?? null;
    }

    const token = createToken(user);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        identifier: user.identifier,
        name: user.name,
        role: user.roleModel,
        ...(subRole && { subRole }),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/auth/activate
 *
 * Validates student details, checks email uniqueness, and sends a 6-digit OTP.
 * Does NOT update User/Student docs — the client must re-send the activation
 * details (email, phone, newPassword) with the OTP in verify-otp.
 * This way the student can still re-login with the old password if they leave.
 */

const activateAccount = async (req, res) => {
  try {
    const { identifier, email, newPassword } = req.body;

    if (!identifier || !email || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
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

    // Only students can go through the activation flow
    if (user.roleModel !== "Student") {
      return res.status(400).json({ error: "Only student accounts can be activated" });
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
    const emailTaken = await User.findOne({
      email,
      _id: { $ne: user._id },
    });
    if (emailTaken) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    // Generate and send a 6-digit OTP.
    // User/Student docs are NOT modified here - changes are applied in verifyOTP.
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
 * POST /api/auth/verify-otp
 *
 * Verifies OTP, marks account as active, returns JWT token.
 * Blocks activation temporarily after too many failed attempts.
 */

const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp, email, phone, newPassword } = req.body;

    if (!identifier || !otp || !email || !phone || !newPassword) {
      return res.status(400).json({
        error: "Identifier, OTP, email, phone, and newPassword are all required",
      });
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

    // OTP is correct — now apply the activation data sent by the client
    const passwordHash = await bcrypt.hash(newPassword, 12);

    user.email = email;
    user.passwordHash = passwordHash;
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = undefined;
    await user.save();

    // Update Student profile: set phone and mark as active
    if (user.roleModel === "Student") {
      await Student.findByIdAndUpdate(user.profile, {
        isActive: true,
        phone,
      });
    }

    // Clean up the OTP record
    await OTP.findOneAndDelete({ identifier });

    const token = createToken(user);
    return res.status(200).json({
      message: "Account activated successfully.",
      token,
      user: {
        id: user._id,
        identifier: user.identifier,
        name: user.name,
        role: user.roleModel,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login, activateAccount, verifyOTP };
