const Certificate = require('../models/certificates.model');
const AuditLog = require('../models/auditLogs.model');
const blockchainService = require('../services/blockchain.service');

//Helper: normalise a value to a trimmed lowercase string for comparison 
const norm = (v) => String(v ?? '').trim().toLowerCase();

// GET /:certificateId
exports.verifyById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    //1. Fetch certificate from database 
    const cert = await Certificate.findOne({ certificateId })
      .populate('user', 'name identifier')
      .populate('university', 'name');

    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    if (!cert.isPublic) return res.status(403).json({ error: "Certificate is not public, contact the student for more information" });

    // 2. Check local revocation status 
    if (cert.status === 'revoked') {
      return res.status(400).json({ error: "Certificate has been revoked", status: "revoked" });
    }

    // 3. Query blockchain 
    const bcData = await blockchainService.verifyCertificateOnChain(certificateId);

    let chain = bcData;
    if (typeof bcData === 'string') {
      try { chain = JSON.parse(bcData); } catch (e) { /* keep raw */ }
    }

    // Certificate not found on chain
    if (!chain) {
      return res.status(400).json({
        error: "Certificate not found on the blockchain",
        status: "invalid"
      });
    }

    // 4. Blockchain revocation check 
    if (chain.status === 'revoked') {
      return res.status(400).json({
        error: "Certificate has been revoked on the blockchain",
        status: "revoked"
      });
    }

    // 5. Full cross-field integrity checks 
    // Compare every field stored on-chain against the database record.
    const dbGradYear = cert.graduationDate
      ? new Date(cert.graduationDate).getFullYear().toString()
      : '';

    const checks = [
      {
        field: 'Student ID',
        db: cert.studentId,
        chain: chain.studentId,
        match: norm(cert.studentId) === norm(chain.studentId),
      },
      {
        field: 'Degree',
        db: cert.degree,
        chain: chain.degreeName ?? chain.degree,
        match: norm(cert.degree) === norm(chain.degreeName ?? chain.degree),
      },
      {
        field: 'Major',
        db: cert.major,
        chain: chain.major,
        match: norm(cert.major) === norm(chain.major),
      },
      {
        field: 'GPA',
        db: String(cert.gpa),
        chain: chain.gpa,
        match: norm(cert.gpa) === norm(chain.gpa),
      },
      {
        field: 'Graduation Year',
        db: dbGradYear,
        chain: chain.graduationDate ?? dbGradYear,
        match: norm(dbGradYear) === norm(chain.graduationDate ?? dbGradYear),
      },
      {
        field: 'PDF Hash (IPFS)',
        db: cert.ipfsHash,
        chain: chain.pdfCid,
        match: norm(cert.ipfsHash) === norm(chain.pdfCid),
      },
    ];

    await AuditLog.create({
      actionType: "VERIFY_CERTIFICATE",
      targetId: cert._id,
      details: `Public verification of certificate ${certificateId}`,
      ipAddress: req.ip
    });

    // Only evaluate fields that actually exist on-chain
    const evaluated = checks.filter(c => c.chain !== undefined && c.chain !== null && c.chain !== '');
    const mismatches = evaluated.filter(c => !c.match);

    if (mismatches.length > 0) {
      return res.status(400).json({
        error: "Integrity check failed: certificate data does not match the blockchain record",
        status: "invalid",
      });
    }
    // 7. All checks passed — return verified certificate 
    res.json({
      certificate: {
        certificateId: cert.certificateId,
        user: { name: cert.user?.name },
        university: { name: cert.university?.name },
        status: cert.status,
        degree: cert.degree,
        major: cert.major,
        gpa: cert.gpa,
        graduationDate: cert.graduationDate,
      },
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(503).json({ error: "Verification service temporarily unavailable" });
  }
};
