const Joi = require("joi");
const { objectId } = require("./common");

const createUniStaff = {
  body: Joi.object({
    staffName: Joi.string().trim().min(2).max(100).required(),
    staffIdentifier: Joi.string().trim().min(2).max(50).required(),
  }),
};

const userIdParam = {
  params: Joi.object({
    userId: objectId.required(),
  }),
};

module.exports = { createUniStaff, userIdParam };
