const Joi = require("joi");
const { objectId, pagination } = require("./common");

const issueCertificate = {
  body: Joi.object({
    studentId: Joi.string().trim().required(),
    studentPersonalId: Joi.string().trim().required(),
    degree: Joi.string().trim().required(),
    major: Joi.string().trim().required(),
    gpa: Joi.number().min(0).max(4).required()
      .messages({ "number.min": "GPA must be at least 0", "number.max": "GPA must be at most 4" }),
    graduationDate: Joi.date().iso().max("now").required()
      .messages({ "date.max": "Graduation date cannot be in the future" }),
  }),
};

const revokeCertificate = {
  params: Joi.object({
    certificateId: Joi.string().trim().required(),
  }),
  body: Joi.object({
    reason: Joi.string().trim().min(5).max(500).required()
      .messages({ "string.min": "Revocation reason must be at least 5 characters" }),
    password: Joi.string().required(),
  }),
};

const getCertificateById = {
  params: Joi.object({
    certificateId: Joi.string().trim().required(),
  }),
};

const setCertificateStatus = {
  params: Joi.object({
    certificateId: Joi.string().trim().required(),
  }),
  body: Joi.object({
    isPublic: Joi.boolean().required()
      .messages({ "any.required": "isPublic (true/false) is required" }),
  }),
};

const getUniversityCertificates = {
  query: Joi.object({
    ...pagination,
    status: Joi.string().valid("verified", "revoked"),
    degree: Joi.string().trim(),
    search: Joi.string().trim().max(100),
  }),
};

const getAllCertificates = {
  query: Joi.object({
    ...pagination,
    status: Joi.string().valid("verified", "revoked"),
    university: objectId,
    search: Joi.string().trim().max(100),
  }),
};

module.exports = {
  issueCertificate, revokeCertificate, getCertificateById,
  setCertificateStatus, getUniversityCertificates, getAllCertificates,
};
