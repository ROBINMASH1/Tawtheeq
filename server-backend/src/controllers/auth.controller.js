const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/auth.helpers");

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
    const user = await User.findOne({ identifier });
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

    const token = await createToken(user);

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { login };