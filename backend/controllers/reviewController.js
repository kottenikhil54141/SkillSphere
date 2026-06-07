const Review = require("../models/Review");
const Gig = require("../models/Gig");

const createReview = async (req, res) => {
  try {
    const { gigId, revieweeId, rating, comment } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    const review = await Review.create({
      gig: gigId,
      reviewer: req.user.id,
      reviewee: revieweeId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "name role")
      .populate("gig", "title")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getUserReviews };
