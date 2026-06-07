const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createGig, getAllGigs } = require("../controllers/gigController");

router.post("/", protect, authorizeRoles("client"), createGig);
router.get("/", protect, getAllGigs);

module.exports = router;
