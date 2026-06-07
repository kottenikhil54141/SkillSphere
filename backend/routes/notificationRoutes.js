const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createNotification,
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.post("/", protect, authorizeRoles("admin"), createNotification);
router.get("/me", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;
