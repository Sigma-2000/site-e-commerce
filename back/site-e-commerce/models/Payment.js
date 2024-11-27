const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
    enum: ["pending", "completed", "failed"],
    required: true,
  },
  receipt_url: {
    type: String,
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
