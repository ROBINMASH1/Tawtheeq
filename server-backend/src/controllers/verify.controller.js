const Certificate = require('../models/certificates.model');
const AuditLog = require('../models/auditLogs.model');
const blockchainService = require('../services/blockchain.service');

// GET /:certificateId
exports.verifyById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const cert = await Certificate.findOne({ certificateId })
      .populate('user', 'name identifier')
      .populate('university', 'name');

    if (!cert) return res.status(404).json({ error: "Certificate not found" });

    if (!cert.isPublic) return res.status(403).json({ error: "Certificate is not public, contact the student for more information" });

    // Create Audit Log
    await AuditLog.create({
      actionType: "VERIFY_CERTIFICATE",
      targetId: cert._id,
      details: `Public verification of certificate ${certificateId}`,
      ipAddress: req.ip
    });

    // Query blockchain
    const bcData = await blockchainService.verifyCertificateOnChain(certificateId);

    let parsedBcData = bcData;
    if (typeof bcData === 'string') {
      try { parsedBcData = JSON.parse(bcData); } catch (e) { }
    }

    if (!parsedBcData || parsedBcData.status === 'revoked') {
      return res.status(400).json({ error: "Certificate has been revoked on the blockchain", status: "revoked" });
    }

    //Optional for more integrity checks
    // const retrievePdfCid = await ipfsService.retrieveFromIPFS(cert.ipfsHash);

    // Compare DB ipfsHash with Blockchain pdfCid
    if (parsedBcData.pdfCid && parsedBcData.pdfCid !== cert.ipfsHash) {
      return res.status(400).json({ error: "Integrity check failed: Data hash mismatch the certificate may be forged", status: "invalid" });
    }

    res.json({
      certificate: cert,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(503).json({ error: "Verification service temporarily unavailable" });
  }
};
