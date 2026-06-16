const multer = require('multer');

// Single certificate upload — PDF only, 1 MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed.'), false);
  },
});

// Bulk upload — CSV + ZIP, both kept in memory
// Futuer work : we can save the files in the disk instead of memory for memory efficiency
const bulkUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 * 1024 }, // 200 MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'csv' && file.mimetype === 'text/csv') cb(null, true);
    else if (file.fieldname === 'zip' && (
      file.mimetype === 'application/zip' ||
      file.mimetype === 'application/x-zip-compressed' ||
      file.mimetype === 'application/octet-stream'
    )) cb(null, true);
    else cb(new Error(`Invalid file type for field "${file.fieldname}"`), false);
  },
});

module.exports = { upload, bulkUpload };
