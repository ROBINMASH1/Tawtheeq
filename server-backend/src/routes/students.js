const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const { authMiddleware } = require("../middleware/jwtAuth");
const { requireRole } = require("../middleware/requireRole");

router.post(
  "/create",
  authMiddleware,
  requireRole("uniUser"),
  studentController.createStudent,
);

router.post(
  "/request-activation-otp",
  authMiddleware,
  requireRole("Student"),
  studentController.requestActivationOTP,
);

router.post(
  "/verify-otp",
  authMiddleware,
  requireRole("Student"),
  studentController.verifyOTP,
);

module.exports = router;
