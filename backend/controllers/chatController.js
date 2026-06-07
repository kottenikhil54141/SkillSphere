const Message = require("../models/Message");
const Proposal = require("../models/Proposal");

const sendMessage = async (req, res) => {
  try {
    const { gigId, receiverId, text } = req.body;

    const proposal = await Proposal.findOne({
      gig: gigId,
      status: "accepted",
    });

    if (!proposal) {
      return res.status(400).json({ message: "No accepted proposal found" });
    }

    const message = await Message.create({
      gig: gigId,
      sender: req.user.id,
      receiver: receiverId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { gigId } = req.params;

    const messages = await Message.find({ gig: gigId })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };