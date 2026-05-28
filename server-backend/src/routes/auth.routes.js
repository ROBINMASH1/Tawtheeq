const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require('../middleware/jwtAuth');
const { validate } = require("../middleware/validate");
const authSchemas = require("../validators/auth.validator");

router.post("/login", validate(authSchemas.login), authController.login);

//change password to all roles
router.patch("/change-password", authMiddleware, validate(authSchemas.changePassword), authController.changePassword);

module.exports = router;