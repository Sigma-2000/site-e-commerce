const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  cart_token: {
    type: String,
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  shipping_method: {
    type: String,
    enum: ["pickup_lyon", "colissimo_signature"],
    required: true,
  },
  shipping_price: {
    type: Number,
    required: true,
    default: 0,
  },
  total_price: {
    type: Number,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  status_order: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    required: true,
    default: "pending",
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  /**cart_token: String, */
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
