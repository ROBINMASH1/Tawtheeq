const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require('../middleware/jwtAuth');

router.post("/login", authController.login);

//change password to all roles
router.patch("/change-password", authMiddleware, authController.changePassword);

module.exports = router;