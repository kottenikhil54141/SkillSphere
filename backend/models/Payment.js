const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "paid",
    },
    transactionId: {
      type: String,
      default: () => `TXN-${Date.now()}`,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
