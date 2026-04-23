const crypto = require("crypto");
const University = require("../models/universities.model");

// Helper to generate random temp password
const generateTempPassword = (length = 12) => {
  return crypto
    .randomBytes(Math.ceil(length * 0.75))
    .toString("base64")
    .slice(0, length)
    .replace(/\+/g, "0")
    .replace(/\//g, "1");
};

// Helper to generate a random orgId
const generateOrgId = async () => {
  let isUnique = false;
  let orgId = "";
  while (!isUnique) {
    const randomChars = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()
      .slice(0, 4);
    orgId = `UNI-${randomChars}`;
    const exists = await University.exists({ orgId });
    if (!exists) {
      isUnique = true;
    }
  }
  return orgId;
};

module.exports = { generateTempPassword, generateOrgId };
