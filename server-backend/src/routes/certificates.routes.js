const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/requireRole');
const { enforceUniversityScope } = require('../middleware/enforceUniversityScope');
const { upload, bulkUpload } = require('../middleware/upload');
const certController = require('../controllers/certificate.controller');
const bulkIssuanceController = require('../controllers/bulkIssuance.controller');

// 1. Issue a single certificate (uniUser only)
router.post('/issue', authMiddleware, requireRole('uniUser'), enforceUniversityScope, upload.single('file'), certController.issueCertificate);

// 2. Get logged-in student's certificates (Student only)
router.get('/my', authMiddleware, requireRole('Student'), certController.getMyCertificates);

// 3. Get all certificates for the caller's university (uniUser only)
router.get('/university', authMiddleware, requireRole('uniUser'), enforceUniversityScope, certController.getUniversityCertificates);

// 4. Get all system certificates (MoheAdmin only)
router.get('/all', authMiddleware, requireRole('MoheAdmin'), certController.getAllCertificates);

// 5. Get certificate statistics for a specific university (uniUser only)
router.get('/university/stats', authMiddleware, requireRole('uniUser'), enforceUniversityScope, certController.getUniversityStats);

// 6. Get overall system certificate statistics (MoheAdmin only)
router.get('/stats', authMiddleware, requireRole('MoheAdmin'), certController.getSystemStats);


//  PARAMETERIZED ROUTES

// 7. Revoke a specific certificate (uniUser only)
router.patch('/:certificateId/revoke', authMiddleware, requireRole('uniUser'), enforceUniversityScope, certController.revokeCertificate);

// 8. Get details of a specific certificate by ID
router.get('/:certificateId', authMiddleware, certController.getCertificateById);

// 9. Download the PDF of a specific certificate 
router.get('/:certificateId/download', authMiddleware, certController.downloadCertificate);

// 10. Generate a public share link for a certificate (Student only)
router.post('/:certificateId/share', authMiddleware, requireRole('Student'), certController.shareCertificate);

//11 Set certificate status
router.patch('/:certificateId/status', authMiddleware, requireRole('Student'), certController.setCertificateStatus);

//  BULK ISSUANCE ROUTES

// 13. Preview bulk issuance data from CSV/ZIP (uniUser only)
router.post('/bulk/preview', authMiddleware, requireRole('uniUser'), enforceUniversityScope, bulkUpload.fields([{ name: 'csv', maxCount: 1 }, { name: 'zip', maxCount: 1 }]), bulkIssuanceController.bulkPreview);

// 14. Finalize and execute bulk issuance (uniUser only) — responds immediately with jobId
router.post('/bulk/issue', authMiddleware, requireRole('uniUser'), enforceUniversityScope, bulkIssuanceController.bulkIssue);

// 15. Poll bulk issuance job status (uniUser only)
router.get('/bulk/job/:jobId', authMiddleware, requireRole('uniUser'), bulkIssuanceController.bulkJobStatus);


module.exports = router;
