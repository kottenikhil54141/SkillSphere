const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");
const Notification = require("../models/Notification");

const createProposal = async (req, res) => {
  try {
    const { gigId, coverLetter, bidAmount, estimatedDays } = req.body;

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const proposal = await Proposal.create({
      gig: gigId,
      freelancer: req.user.id,
      coverLetter,
      bidAmount,
      estimatedDays,
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGigProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ gig: req.params.gigId })
      .populate("freelancer", "name email role")
      .populate("gig", "title budget deadline");

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.status = "accepted";
    await proposal.save();

    await Gig.findByIdAndUpdate(proposal.gig, {
      status: "in_progress",
    });

    await Notification.create({
  user: proposal.freelancer,
  message: "🎉 Your proposal has been accepted!",
});

    res.json({ message: "Proposal accepted", proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.status = "rejected";
    await proposal.save();

    await Notification.create({
  user: proposal.freelancer,
  message: "❌ Your proposal has been rejected.",
});

    res.json({ message: "Proposal rejected", proposal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user.id })
      .populate("gig", "title budget deadline status client")
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProposal,
  getGigProposals,
  acceptProposal,
  rejectProposal,
  getMyProposals,
};
