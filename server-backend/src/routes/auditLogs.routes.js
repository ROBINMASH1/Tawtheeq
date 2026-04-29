const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/requireRole');
const auditLogController = require('../controllers/auditLog.controller');

router.get('/', authMiddleware, requireRole('MoheAdmin'), auditLogController.getAuditLogs);
router.get('/export', authMiddleware, requireRole('MoheAdmin'), auditLogController.exportAuditLogs);

module.exports = router;
