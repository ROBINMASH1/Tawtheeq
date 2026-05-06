const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

//reset password to all roles
//router.patch("/:userId/reset-password", authMiddleware, resetPassword);



module.exports = router;