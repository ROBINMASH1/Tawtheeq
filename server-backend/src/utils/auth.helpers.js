const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Student = require("../models/students.model");
const UniUser = require("../models/uniUsers.model");

const createToken = async (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload = {
      userId: user._id,
      identifier: user.identifier,
      roleModel: user.roleModel,
      name: user.name,
    };

    // For uniUsers, fetch the sub-role (Uniadmin / UniStaff) from the profile
    if (user.roleModel === "uniUser") {
      const uniUserProfile = await UniUser.findById(user.profile);
      payload.subRole = uniUserProfile?.role ?? null;
    }

    // For students, fetch the activation status and contact info from the profile if active
    if (user.roleModel === "Student") {
      const studentProfile = await Student.findById(user.profile);
      if (studentProfile?.isActive) {
        payload.isActive = true;
        payload.email = studentProfile.email;
        payload.phone = studentProfile.phone;
      } else {
        payload.isActive = false;
      }
    }

    return jwt.sign(
      payload,
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



module.exports = { createToken, sendOTPEmail };
