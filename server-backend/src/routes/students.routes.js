const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const { authMiddleware } = require("../middleware/jwtAuth");
const { requireRole } = require("../middleware/requireRole");
const { validate } = require("../middleware/validate");
const studentSchemas = require("../validators/student.validator");

router.post("/create", authMiddleware, requireRole("uniUser"), validate(studentSchemas.createStudent), studentController.createStudent);

router.post("/request-activation-otp", authMiddleware, requireRole("Student"), validate(studentSchemas.requestActivationOTP), studentController.requestActivationOTP);

router.post("/verify-otp", authMiddleware, requireRole("Student"), validate(studentSchemas.verifyOTP), studentController.verifyOTP);

router.post("/send-otp-forgot-password", validate(studentSchemas.sendOTPForgotPassword), studentController.sendOTPForgotPassword);

router.post("/verify-otp-forgot-password", validate(studentSchemas.verifyOTPForgotPassword), studentController.verifyOTPForgotPassword);

router.post("/request-change-email-otp", authMiddleware, requireRole("Student"), validate(studentSchemas.requestChangeEmailOTP), studentController.requestChangeEmailOTP);

router.post("/change-email", authMiddleware, requireRole("Student"), validate(studentSchemas.changeEmail), studentController.changeEmail);

router.post("/change-phone-number", authMiddleware, requireRole("Student"), validate(studentSchemas.changePhoneNumber), studentController.changePhoneNumber);

module.exports = router;
