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

module.exports = router;
