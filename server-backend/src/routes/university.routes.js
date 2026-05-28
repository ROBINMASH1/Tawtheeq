const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/requireRole');
const { verifyPassword } = require('../middleware/verifyPassword');
const { createUniversity, getAllUniversities, getUniversityById, updateUniversity, deleteUniversity } = require('../controllers/university.controller');
const { validate } = require('../middleware/validate');
const universitySchemas = require('../validators/university.validator');

router.post('/create', authMiddleware, requireRole('MoheAdmin'), validate(universitySchemas.createUniversity), createUniversity);

router.get('/all', authMiddleware, requireRole('MoheAdmin'), validate(universitySchemas.getAllUniversities), getAllUniversities);

router.get('/get/:id', authMiddleware, requireRole('MoheAdmin', 'Uniadmin'), validate(universitySchemas.getUniversityById), getUniversityById);

router.put('/update/:id', authMiddleware, requireRole('MoheAdmin'), validate(universitySchemas.updateUniversity), updateUniversity);

router.delete('/delete/:id', authMiddleware, verifyPassword, requireRole('MoheAdmin'), validate(universitySchemas.deleteUniversity), deleteUniversity);

module.exports = router;
