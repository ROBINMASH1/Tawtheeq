const Joi = require("joi");
const { password } = require("./common");

const login = {
  body: Joi.object({
    identifier: Joi.string().trim().required(),
    password: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    password: password.required(),
  }),
};

module.exports = { login, changePassword };
