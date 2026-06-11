const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    } /*
    stripe_checkout_session_id: {
      type: String,
      required: true,
      unique: true,
    },*/,
    stripe_checkout_session_id: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    payment_intent_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed", "paid", "cancelled", "expired"],
      required: true,
    },
    receipt_url: {
      type: String,
    },
    paid_at: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
