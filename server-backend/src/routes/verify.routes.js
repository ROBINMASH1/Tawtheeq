const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verify.controller');

router.get('/:certificateId', verifyController.verifyById);


module.exports = router;
