const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

//reset password to all roles
router.patch("/reset-password", authMiddleware, authController.resetPassword);

module.exports = router;