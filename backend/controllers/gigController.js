const Gig = require("../models/Gig");

const createGig = async (req, res) => {
  try {
    const { title, description, budget, deadline, category } = req.body;

    const gig = await Gig.create({
      title,
      description,
      budget,
      deadline,
      category,
      client: req.user.id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().populate("client", "name email role");
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGig, getAllGigs };
