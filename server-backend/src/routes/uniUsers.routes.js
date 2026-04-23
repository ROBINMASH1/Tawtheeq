const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/requireRole');
const { verifyPassword } = require('../middleware/verifyPassword');
const { createUniStaff, getAllUniAdmins, resetUniAdminPassword, getAllUniStaff, resetUniStaffPassword, deleteUniStaff } = require('../controllers/uniUsers.controller');

router.get('/admins', authMiddleware, requireRole('MoheAdmin'), getAllUniAdmins);
router.patch('/admins/:userId/reset-password', authMiddleware, requireRole('MoheAdmin'), resetUniAdminPassword);

router.post('/staff/create', authMiddleware, requireRole('Uniadmin'), createUniStaff);
router.get('/staff/all', authMiddleware, requireRole('Uniadmin'), getAllUniStaff);
router.patch('/staff/:userId/reset-password', authMiddleware, requireRole('Uniadmin'), resetUniStaffPassword);

router.delete('/staff/:userId', authMiddleware, verifyPassword, requireRole('Uniadmin'), deleteUniStaff);

module.exports = router;
