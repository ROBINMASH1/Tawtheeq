const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter to only accept PDFs
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

// Create the Multer instance for single PDF uploads (10MB size limit)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: pdfFileFilter,
});


module.exports = { upload };
