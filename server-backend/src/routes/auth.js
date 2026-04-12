const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

router.post("/activate", authController.activateAccount);

router.post("/verify-otp", authController.verifyOTP);

module.exports = router;
