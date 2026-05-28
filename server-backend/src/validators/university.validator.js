const Joi = require("joi");
const { objectId, email, pagination } = require("./common");

const createUniversity = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    licenseNumber: Joi.string().trim().required(),
    address: Joi.string().trim().max(500).allow("", null),
    contactEmail: email.required(),
    Initialism: Joi.string().trim().uppercase().min(2).max(10).required()
      .messages({ "any.required": "University initialism is required" }),
  }),
};

const updateUniversity = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200),
    address: Joi.string().trim().max(500).allow("", null),
    contactEmail: email,
    orgId: Joi.forbidden().messages({ "any.unknown": "orgId cannot be changed" }),
    licenseNumber: Joi.forbidden().messages({ "any.unknown": "licenseNumber cannot be changed" }),
  }),
};

const deleteUniversity = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const getUniversityById = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const getAllUniversities = {
  query: Joi.object({
    ...pagination,
  }),
};

module.exports = { createUniversity, updateUniversity, deleteUniversity, getUniversityById, getAllUniversities };
