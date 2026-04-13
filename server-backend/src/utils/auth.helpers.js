const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Student = require("../models/students.model");

const createToken = (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(
      {
        id: user._id,
        identifier: user.identifier,
        role: user.roleModel,
        profile: user.profile,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
  } catch (error) {
    console.error("Error creating token:", error);
    throw error;
  }
};

const sendOTPEmail = async (toEmail, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: toEmail,
      subject: "Tawtheeq – Your Verification Code",
      text: `Your OTP code is: ${otp}\n\nThis code expires in 5 minutes.`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

const checkStudentActivation = async (user, res) => {
  const studentProfile = await Student.findById(user.profile);

  if (!studentProfile?.isActive) {
    res.status(200).json({
      identifier: user.identifier,
      message: "Please complete your profile to activate your account.",
    });
    return true;
  }

  return false;
};

module.exports = { createToken, sendOTPEmail, checkStudentActivation };
