const crypto = require('crypto');

// Generates a unique Certificate ID.
exports.generateCertificateId = (universityOrgId) => {
  const year = new Date().getFullYear();

  // Generate a 6-character random alphanumeric string (excluding confusing chars like 0, O, I, 1)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let shortId = '';
  const randomBytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    shortId += chars[randomBytes[i] % chars.length];
  }

  const orgStr = universityOrgId ? universityOrgId.toString().substring(0, 3).toUpperCase() : 'UNI';
  return `TAWQ-${orgStr}-${year}-${shortId}`; //TAWQ-MEU-2026-123456
};

