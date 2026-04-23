const bcrypt = require("bcrypt");
const User = require("../models/users.model");

const verifyPassword = async (req, res, next) => {
  try {
    const password = req.body?.password;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to confirm this action.",
      });
    }

    const user = await User.findById(req.user._id).select("passwordHash");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Authenticated user not found.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Action denied.",
      });
    }

    next();
  } catch (error) {
    console.error("Password verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = { verifyPassword };
