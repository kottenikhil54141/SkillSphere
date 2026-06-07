const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createProposal,
  getGigProposals,
  acceptProposal,
  rejectProposal,
  getMyProposals,
} = require("../controllers/proposalController");

router.post("/", protect, authorizeRoles("freelancer"), createProposal);
router.get("/me", protect, authorizeRoles("freelancer"), getMyProposals);
router.get("/:gigId", protect, authorizeRoles("client"), getGigProposals);
router.put("/:id/accept", protect, authorizeRoles("client"), acceptProposal);
router.put("/:id/reject", protect, authorizeRoles("client"), rejectProposal);

module.exports = router;