const { parse } = require('csv-parse/sync');
const AdmZip = require('adm-zip');
const User = require('../models/users.model');
const Certificate = require('../models/certificates.model');
const AuditLog = require('../models/auditLogs.model');
const qrService = require('./qr.service');
const ipfsService = require('./ipfs.service');
const blockchainService = require('./blockchain.service');
const certService = require('./certificate.service');

// Parse CSV buffer → array of row objects
exports.parseCSV = (csvBuffer) => {
  try {
    const rows = parse(csvBuffer, { columns: true, skip_empty_lines: true, trim: true });
    return { rows, error: null };
  } catch (err) {
    return { rows: [], error: err.message };
  }
};

// Extract ZIP buffer → Map<lowercaseFilename, Buffer>
exports.extractZipEntries = (zipBuffer) => {
  const zip = new AdmZip(zipBuffer);
  const pdfMap = new Map();

  zip.getEntries().forEach(entry => {
    if (!entry.isDirectory && entry.entryName.toLowerCase().endsWith('.pdf')) {
      const basename = entry.entryName.split('/').pop().split('\\').pop().toLowerCase();
      pdfMap.set(basename, entry.getData());
    }
  });

  return pdfMap;
};

// Validate a single CSV row
exports.validateRow = (row, rowIndex, pdfMap, existingStudentsMap, existingCertsSet, seenIds) => {
  const { personalId, studentId, studentName, degree, major, gpa, graduationDate } = row;

  if (!personalId || !studentId || !studentName || !degree || !major || !gpa || !graduationDate)
    return { ...row, rowIndex, status: 'error', error: 'Missing required fields' };

  if (isNaN(parseFloat(gpa)) || parseFloat(gpa) < 0 || parseFloat(gpa) > 4)
    return { ...row, rowIndex, status: 'error', error: 'Invalid GPA (must be 0–4)' };

  // if (isNaN(Date.parse(graduationDate)))
  //   return { ...row, rowIndex, status: 'error', error: 'Invalid graduation date' };

  if (seenIds.has(personalId))
    return { ...row, rowIndex, status: 'error', error: 'Duplicate entry in CSV' };
  seenIds.add(personalId);

  if (!pdfMap.has(`${studentId}.pdf`.toLowerCase()))
    return { ...row, rowIndex, status: 'error', error: `PDF not found: ${studentId}.pdf` };

  const studentFound = existingStudentsMap.has(personalId);

  if (existingCertsSet.has(`${personalId}_${degree}`))
    return { ...row, rowIndex, status: 'error', error: 'Certificate already issued for this degree' };

  return { ...row, rowIndex, studentFound, pdfFound: true, status: 'valid', error: null };
};

// Parse DD/MM/YYYY or YYYY-MM-DD date strings into JS Date
function parseDate(dateStr) {
  if (!dateStr) return null;
  // Handle DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  }
  // Fallback: let JS parse it (works for YYYY-MM-DD, etc.)
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

// Process a single validated row - full issuance pipeline
exports.processRow = async (row, pdfBuffer, universityId, issuedByUserId, universityName) => {
  const { personalId, studentId, degree, major, gpa, graduationDate } = row;
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 1. Look up student (optional - university may issue before student registers)
      const student = await User.findOne({ identifier: personalId, roleModel: 'Student' });

      // 2. Generate certificate ID
      const certificateId = certService.generateCertificateId(universityId);

      // 3. Generate QR code and embed it into the PDF
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificateId}`;
      const qrBuffer = await qrService.generateQRCode(verificationUrl);
      const modifiedPdf = await qrService.embedQRInPDF(pdfBuffer, qrBuffer);

      // 4. Upload PDF to IPFS
      const ipfsHash = await ipfsService.uploadToIPFS(modifiedPdf, `${personalId}_${certificateId}.pdf`);

      // 5. Record on blockchain (last external side-effect)
      const parsedGradDate = parseDate(graduationDate);
      const gradYear = parsedGradDate ? parsedGradDate.getFullYear().toString() : graduationDate;
      const blockchainResponse = await blockchainService.issueCertificate(
        certificateId, studentId, degree, major, String(gpa), universityName, gradYear, ipfsHash
      );
      // Extract just the transaction ID string from the Kaleido response object
      const txHash = blockchainResponse?.transactionID || blockchainResponse?.headers?.id || String(blockchainResponse);

      // 6. Save certificate to database
      const certificate = await Certificate.create({
        certificateId,
        user: student ? student._id : null,
        university: universityId,
        studentId,
        personalId,
        ipfsHash,
        blockchainTxHash: txHash,
        status: 'verified',
        degree,
        major,
        gpa,
        graduationDate: parsedGradDate,
        issuedBy: issuedByUserId,
        isPublic: true,
      });

      // 7. Write audit log
      await AuditLog.create({
        actionType: 'ISSUE_CERTIFICATE',
        performedBy: issuedByUserId,
        targetId: certificate._id,
        details: `Bulk issued certificate ${certificateId} for student ${personalId}`,
        ipAddress: 'bulk_issuance',
      });

      return { rowIndex: row.rowIndex, personalId, status: 'success', certificateId };

    } catch (error) {
      console.warn(`[processRow] Attempt ${attempt}/${MAX_RETRIES} failed for student ${personalId}:`, error.message);

      if (attempt === MAX_RETRIES) {
        return { rowIndex: row.rowIndex, personalId, status: 'failed', error: error.message };
      }

      // Wait before next attempt (progressive delay: 1s, 2s)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};
