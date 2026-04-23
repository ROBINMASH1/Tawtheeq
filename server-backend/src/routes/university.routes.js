const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/requireRole');
const { verifyPassword } = require('../middleware/verifyPassword');
const { createUniversity, getAllUniversities, getUniversityById, updateUniversity, deleteUniversity } = require('../controllers/university.controller');

router.post('/create', authMiddleware, requireRole('MoheAdmin'), createUniversity);

router.get('/all', authMiddleware, requireRole('MoheAdmin'), getAllUniversities);

router.get('/get/:id', authMiddleware, requireRole('MoheAdmin', 'Uniadmin'), getUniversityById);

router.put('/update/:id', authMiddleware, requireRole('MoheAdmin'), updateUniversity);

router.delete('/delete/:id', authMiddleware, verifyPassword, requireRole('MoheAdmin'), deleteUniversity);

module.exports = router;
