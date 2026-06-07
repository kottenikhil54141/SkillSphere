const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createPayment, getMyPayments } = require("../controllers/paymentController");

router.post("/", protect, authorizeRoles("client"), createPayment);
router.get("/me", protect, getMyPayments);

module.exports = router;
