const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message("{{#label}} must be a valid ObjectId");

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/, "uppercase letter")
  .pattern(/[a-z]/, "lowercase letter")
  .pattern(/[0-9]/, "digit")
  .pattern(/[^A-Za-z0-9]/, "special character")
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 128 characters",
    "string.pattern.name": "Password must contain at least one {#name}",
  });

const email = Joi.string().email().trim().lowercase();

const phone = Joi.string()
  .pattern(/^\+?[0-9]{10,15}$/)
  .message("Phone must be a valid number (10-15 digits, optional + prefix)");

const pagination = {
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
};

module.exports = { objectId, password, email, phone, pagination };
