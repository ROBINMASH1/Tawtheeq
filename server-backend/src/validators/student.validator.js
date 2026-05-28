const Joi = require("joi");
const { password, email, phone } = require("./common");

const createStudent = {
  body: Joi.object({
    personalId: Joi.string().trim().required()
      .messages({ "any.required": "Personal ID is required" }),
    name: Joi.string().trim().min(2).max(100).required()
      .messages({ "any.required": "Name is required" }),
  }),
};

const requestActivationOTP = {
  body: Joi.object({
    identifier: Joi.string().trim().required(),
    email: email.required(),
    phone: phone.required(),
  }),
};

const verifyOTP = {
  body: Joi.object({
    identifier: Joi.string().trim().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required()
      .messages({ "string.length": "OTP must be exactly 6 digits", "string.pattern.base": "OTP must contain only digits" }),
    email: email.required(),
    phone: phone.required(),
    newPassword: password.required(),
  }),
};

const sendOTPForgotPassword = {
  body: Joi.object({
    email: email.required(),
  }),
};

const verifyOTPForgotPassword = {
  body: Joi.object({
    email: email.required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
    newPassword: password.required(),
  }),
};

const requestChangeEmailOTP = {
  body: Joi.object({
    email: email.required(),
  }),
};

const changeEmail = {
  body: Joi.object({
    email: email.required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
  }),
};

const changePhoneNumber = {
  body: Joi.object({
    phone: phone.required(),
  }),
};

module.exports = {
  createStudent, requestActivationOTP, verifyOTP,
  sendOTPForgotPassword, verifyOTPForgotPassword,
  requestChangeEmailOTP, changeEmail, changePhoneNumber,
};
