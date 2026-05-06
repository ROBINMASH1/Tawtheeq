const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const { authMiddleware } = require("../middleware/jwtAuth");
const { requireRole } = require("../middleware/requireRole");

router.post("/create", authMiddleware, requireRole("uniUser"), studentController.createStudent);

router.post("/request-activation-otp", authMiddleware, requireRole("Student"), studentController.requestActivationOTP);

router.post("/verify-otp", authMiddleware, requireRole("Student"), studentController.verifyOTP);

router.post("/send-otp-forgot-password", studentController.sendOTPForgotPassword);

router.post("/verify-otp-forgot-password", studentController.verifyOTPForgotPassword);

//Change email
//router.post("/change-email", authMiddleware, requireRole("Student"), studentController.changeEmail);

//Change phone number
//router.post("/change-phone-number", authMiddleware, requireRole("Student"), studentController.changePhoneNumber);


module.exports = router;
