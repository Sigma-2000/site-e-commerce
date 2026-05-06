const mongoose = require("mongoose");
const { Schema } = mongoose;
/*const CartSchema = new Schema({
  token: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    }
  ],
  expires_at: { type: Date, required: true },
}, { timestamps: true }); créer un models indépendant?*/

const PaymentSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    } /**  order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    }, */,
    stripe_checkout_session_id: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["pending", "completed", "failed", "paid", "cancelled,expired"],
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
