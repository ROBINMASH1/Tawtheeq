const Certificate = require('../models/certificates.model');
const User = require('../models/users.model');
const AuditLog = require('../models/auditLogs.model');
const University = require('../models/universities.model');

const moheService = require('../services/mohe.service');
const qrService = require('../services/qr.service');
const ipfsService = require('../services/ipfs.service');
const blockchainService = require('../services/blockchain.service');
const certService = require('../services/certificate.service');

// POST /issue
exports.issueCertificate = async (req, res) => {
  let savedCertificate = null; // Track DB writes for manual rollback
  try {
    const startTime = Date.now();
    const { studentId, studentPersonalId, degree, major, gpa, graduationDate } = req.body;
    const file = req.file; // from multer

    if (!file) {
      return res.status(400).json({ error: "PDF certificate file is required" });
    }

    if (!studentId || !studentPersonalId || !degree || !major || !gpa || !graduationDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const universityId = req.universityScope;

    const existingCert = await Certificate.findOne({
      personalId: studentPersonalId,
      degree: degree,
      university: universityId
    });

    if (existingCert) {
      return res.status(409).json({ error: "Certificate already issued for this student and degree" });
    }

    // Detached mode: find student account if it exists, but don't require it.
    // If the student hasn't registered yet, the certificate is issued without a linked account.
    // When they register later, GET /my will auto-match via studentPersonalId.
    const student = await User.findOne({ identifier: studentPersonalId, roleModel: 'Student' });

    // 2. Validate MOHE Status (Commented out by default)
    // await moheService.validateGraduationStatus(student.identifier);

    // 3. Generate Certificate ID
    const certificateId = certService.generateCertificateId(universityId);

    // 4. Generate QR Code
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificateId}`;
    const qrBuffer = await qrService.generateQRCode(verificationUrl);

    // 5. Embed QR in PDF
    const modifiedPdfBuffer = await qrService.embedQRInPDF(file.buffer, qrBuffer);

    // 6. Upload to IPFS
    // Use studentPersonalId directly — student account may not exist yet
    const fileName = `${studentPersonalId}_${certificateId}.pdf`;
    const ipfsHash = await ipfsService.uploadToIPFS(modifiedPdfBuffer, fileName);

    // 7. Issue to Blockchain BEFORE saving to DB
    // This ensures no orphaned DB records if blockchain fails
    const gradYear = new Date(graduationDate).getFullYear().toString();
    const universityDoc = await University.findById(universityId);
    const universityName = universityDoc ? universityDoc.name : universityId.toString();

    const txData = await blockchainService.issueCertificate(
      certificateId,
      studentId,
      degree,
      major,
      gpa,
      universityName,
      gradYear,
      ipfsHash
    );

    // 8. All external operations succeeded - now save to DB
    // user field is optional - will be null if student hasn't registered yet
    const certificate = new Certificate({
      certificateId,
      user: student?._id ?? undefined,
      university: universityId,
      studentId,
      personalId: studentPersonalId,
      ipfsHash,
      status: "verified",
      degree,
      major,
      gpa,
      graduationDate,
      issuedBy: req.user._id,
      isPublic: true,
      blockchainTxHash: txData.transactionID
    });

    await certificate.save();
    savedCertificate = certificate;

    // 9. Create Audit Log
    await AuditLog.create({
      actionType: "ISSUE_CERTIFICATE",
      performedBy: req.user._id,
      targetId: certificate._id,
      details: `Issued certificate ${certificateId} for student ${studentPersonalId}`,
      ipAddress: req.ip
    });

    console.log(`[issueCertificate] Response time: ${Date.now() - startTime}ms`);
    res.status(201).json({ success: true, certificateId, txHash: txData.transactionID, ipfsHash });
  } catch (error) {
    // Manual rollback: delete the certificate if it was saved to DB
    if (savedCertificate) {
      try {
        await Certificate.deleteOne({ _id: savedCertificate._id });
        console.warn(`[issueCertificate] Rolled back certificate ${savedCertificate.certificateId} from DB due to error`);
      } catch (rollbackError) {
        console.error("[issueCertificate] CRITICAL: Rollback failed, orphaned certificate in DB:", rollbackError);
      }
    }

    console.error("Issuance Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to issue certificate" });
  }
};

// PATCH /:certificateId/revoke
exports.revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Revocation reason is required" });
    }

    const cert = await Certificate.findOne({ certificateId });
    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    if (cert.university.toString() !== req.universityScope.toString()) {
      return res.status(403).json({ error: "Access denied to revoke certificate from another university" });
    }

    if (cert.status === 'revoked') {
      return res.status(400).json({ error: "Certificate is already revoked" });
    }

    // 1. Blockchain first — no DB changes until this succeeds
    const txHash = await blockchainService.revokeCertificateOnChain(certificateId, reason);

    // 2. Blockchain succeeded — now update DB
    cert.status = 'revoked';
    await cert.save();

    // 3. Create Audit Log
    await AuditLog.create({
      actionType: "REVOKE_CERTIFICATE",
      performedBy: req.user._id,
      targetId: cert._id,
      details: `Revoked certificate ${certificateId}. Reason: ${reason}`,
      ipAddress: req.ip
    });

    res.json({ success: true, message: "Certificate revoked successfully", txHash: txHash.transactionID });
  } catch (error) {
    console.error("Revocation Error:", error);
    res.status(500).json({ error: "Failed to revoke certificate" });
  }
};

// GET /my
exports.getMyCertificates = async (req, res) => {
  try {
    // Match by both linked user account AND by personalId
    const certificates = await Certificate.find({
      $or: [
        { user: req.user._id },
        { personalId: req.user.identifier, user: { $exists: false } }
      ]
    })
      .populate('university', 'name')
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
};

// GET /:certificateId
exports.getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId })
      .populate('user', 'name identifier')
      .populate('university', 'name');

    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    switch (req.user.roleModel) {
      case "Student":
        if (cert.user._id.toString() !== req.user._id.toString())
          return res.status(403).json({ error: "Access denied" });
        break;
      case "uniUser":
        if (cert.university._id.toString() !== req.user.profile.university.toString())
          return res.status(403).json({ error: "Access denied" });
        break;
      case "MoheAdmin":
        break;
    }

    res.json(cert);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
};

exports.setCertificateStatus = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { isPublic } = req.body; //true or false

    const cert = await Certificate.findOne({ certificateId });
    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    if (cert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied to set certificate status for another student" });
    }

    cert.isPublic = isPublic;
    await cert.save();

    await AuditLog.create({
      actionType: "SET_CERTIFICATE_STATUS",
      performedBy: req.user._id,
      targetId: cert._id,
      details: `Set certificate ${certificateId} isPublic status to ${isPublic}`,
      ipAddress: req.ip
    });

    res.json({ success: true, message: "Certificate status set successfully", cert });
  } catch (error) {
    console.error("Set certificate status Error:", error);
    res.status(500).json({ error: "Failed to set certificate status" });
  }
}

// GET /:certificateId/download
exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId });

    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    switch (req.user.roleModel) {
      case "Student":
        if (cert.user.toString() !== req.user._id.toString())
          return res.status(403).json({ error: "Access denied" });
        break;
      case "uniUser":
        if (cert.university.toString() !== req.user.profile.university.toString())
          return res.status(403).json({ error: "Access denied" });
        break;
      case "MoheAdmin":
        break;
    }

    const stream = await ipfsService.downloadFromIPFS(cert.ipfsHash);
    const filename = `${cert.personalId}_${cert.certificateId}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    stream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to process download request" });
  }
};

// GET /university
exports.getUniversityCertificates = async (req, res) => {
  try {
    const universityId = req.universityScope;
    const { status, degree, search, page = 1, limit = 10 } = req.query;

    const query = { university: universityId };
    if (status) query.status = status;
    if (degree) query.degree = degree;
    if (search) query.certificateId = { $regex: search, $options: 'i' };

    const certificates = await Certificate.find(query)
      .populate('user', 'name identifier')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Certificate.countDocuments(query);

    res.json({
      data: certificates,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch university certificates" });
  }
};

// GET /all
exports.getAllCertificates = async (req, res) => {
  try {
    const { status, university, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (university) query.university = university;
    if (search) query.certificateId = { $regex: search, $options: 'i' };

    const certificates = await Certificate.find(query)
      .populate('user', 'name identifier')
      .populate('university', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Certificate.countDocuments(query);

    res.json({
      data: certificates,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all certificates" });
  }
};

// GET /university/stats
exports.getUniversityStats = async (req, res) => {
  try {
    const universityId = req.universityScope;

    const totalIssued = await Certificate.countDocuments({ university: universityId });
    const totalRevoked = await Certificate.countDocuments({ university: universityId, status: 'revoked' });

    const certs = await Certificate.find({ university: universityId }).select('_id');
    const certIds = certs.map(c => c._id);
    const totalVerifications = await AuditLog.countDocuments({
      actionType: "VERIFY_CERTIFICATE",
      targetId: { $in: certIds }
    });

    res.json({ totalIssued, totalRevoked, totalVerifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch university stats" });
  }
};

// GET /stats
exports.getSystemStats = async (req, res) => {
  try {
    const totalIssued = await Certificate.countDocuments();
    const totalRevoked = await Certificate.countDocuments({ status: 'revoked' });
    const totalVerifications = await AuditLog.countDocuments({ actionType: "VERIFY_CERTIFICATE" });

    res.json({ totalIssued, totalRevoked, totalVerifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch system stats" });
  }
};

// POST /:certificateId/share
exports.shareCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId });

    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    if (req.user.roleModel !== "Student" || cert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    const shareLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificateId}`;
    res.json({ shareLink });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate share link" });
  }
};
