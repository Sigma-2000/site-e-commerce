const express = require("express");
const Stripe = require("stripe");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  console.log("🔥 NEW CHECKOUT SESSION CONTROLLER", req.body);

  const { order_id } = req.body;
  const frontendUrl = process.env.FRONTEND_URL;

  try {
    if (!frontendUrl) {
      return res.status(500).json({
        error: "Missing FRONTEND_URL env variable",
      });
    }

    if (!order_id) {
      return res.status(400).json({
        error: "Missing order_id",
      });
    }

    const order = await Order.findById(order_id).populate("products.id");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const lineItems = order.products.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.id.title?.fr || item.id.title?.en || "Artwork",
        },
        unit_amount: Math.round(item.id.price * 100),
      },
      quantity: item.quantity,
    }));

    if (order.shipping_price > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name:
              order.shipping_method === "colissimo_signature"
                ? "Colissimo France avec signature"
                : "Livraison",
          },
          unit_amount: Math.round(order.shipping_price * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/payment/cancel?order_id=${order._id}`,

      metadata: {
        order_id: String(order._id),
        cart_token: order.cart_token,
      },
    });

    const payment = await Payment.create({
      user_id: order.user_id,
      order_id: order._id,
      stripe_checkout_session_id: session.id,
      amount: order.total_price * 100,
      currency: "eur",
      payment_status: "pending",
    });

    order.payment_id = payment._id;
    await order.save();

    return res.json({ url: session.url });
  } catch (error) {
    console.error("createCheckoutSession error:", error);
    return res.status(500).json({
      error: "Error creating checkout session",
      details: error.message,
    });
  }
};

const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const payment = await Payment.findOneAndUpdate(
        { stripe_checkout_session_id: session.id },
        {
          payment_status: "completed",
          payment_intent_id: session.payment_intent,
          paid_at: new Date(),
        },
        { new: true },
      );

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      const order = await Order.findByIdAndUpdate(
        payment.order_id,
        { status_order: "paid" },
        { new: true },
      );

      if (order?.cart_token) {
        await Cart.findOneAndUpdate(
          { token: order.cart_token },
          { status: "ordered" },
        );
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      const payment = await Payment.findOneAndUpdate(
        { stripe_checkout_session_id: session.id },
        { payment_status: "expired" },
        { new: true },
      );

      if (payment) {
        const order = await Order.findByIdAndUpdate(
          payment.order_id,
          { status_order: "cancelled" },
          { new: true },
        );

        if (order?.cart_token) {
          await Cart.findOneAndUpdate(
            { token: order.cart_token },
            { status: "cancelled" },
          );
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("stripeWebhook error:", error);
    return res.status(500).json({ error: "Webhook handling failed" });
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
};
