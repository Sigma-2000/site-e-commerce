const express = require("express");
const Stripe = require("stripe");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
/**createCheckoutSession
stripeWebhook quand on change pour stripe balal */

const createPayment = async (req, res) => {
  const { amount, currency, user_id, order_id } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    const newPayment = new Payment({
      user_id,
      order_id,
      payment_intent_id: paymentIntent.id,
      amount,
      currency,
      payment_status: "pending",
    });

    await newPayment.save();

    await Order.findByIdAndUpdate(order_id, { payment_id: newPayment._id });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while the creation of the payment",
      details: error.message,
    });
  }
};

const confirmPayment = async (req, res) => {
  const { payment_intent_id } = req.body;

  try {
    if (!payment_intent_id) {
      return res.status(400).json({ error: "Missing payment_intent_id" });
    }

    const paymentIntent =
      await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status === "succeeded") {
      const updatedPayment = await Payment.findOneAndUpdate(
        { payment_intent_id },
        {
          payment_status: "completed",
        },
        { new: true },
      );
      const order = await Order.findOneAndUpdate(
        { payment_id: updatedPayment._id },
        { status_order: "paid" },
        { new: true },
      );

      if (!order) {
        return res.status(404).json({ error: "Order not found for payment" });
      }

      await Cart.findOneAndUpdate(
        { token: order.cart_token },
        { status: "ordered" },
      );

      return res.json({
        message: "Payment successfully confirmed",
        order: updatedPayment,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Payment failed" });
  }
};

module.exports = {
  createPayment,
  confirmPayment,
};
