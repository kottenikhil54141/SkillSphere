const Payment = require("../models/Payment");
const Proposal = require("../models/Proposal");
const Gig = require("../models/Gig");
const Notification = require("../models/Notification");

const createPayment = async (req, res) => {
  try {
    const { gigId, amount } = req.body;

    const acceptedProposal = await Proposal.findOne({
      gig: gigId,
      status: "accepted",
    });

    if (!acceptedProposal) {
      return res.status(400).json({ message: "No accepted proposal for this gig" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const payment = await Payment.create({
      gig: gigId,
      payer: req.user.id,
      payee: acceptedProposal.freelancer,
      amount,
      status: "paid",
    });

    gig.status = "completed";
    await gig.save();

    await Notification.create({
      user: acceptedProposal.freelancer,
      message: "Payment released for your completed work.",
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ payer: req.user.id }, { payee: req.user.id }],
    })
      .populate("gig", "title status")
      .populate("payer", "name role")
      .populate("payee", "name role")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, getMyPayments };
