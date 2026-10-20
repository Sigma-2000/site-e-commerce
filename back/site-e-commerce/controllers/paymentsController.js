const express = require("express");
const Stripe = require("stripe");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const EmailJob = require("../models/EmailJob");
const {
  cancelOrderAndRestoreStock,
} = require("../services/orderCancellationService");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
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
    if (String(order.user_id) !== String(req.user.id)) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }
    if (order.status_order !== "pending") {
      return res.status(409).json({
        error: "Order is not available for payment",
      });
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
      payment_method_types: ["card"],
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

      if (session.payment_status !== "paid") {
        return res.json({ received: true });
      }

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
        {
          new: true,
          runValidators: true,
        },
      ).populate({
        path: "user_id",
        select: "email firstName lastName",
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order?.cart_token) {
        await Cart.findOneAndUpdate(
          { token: order.cart_token },
          { status: "ordered" },
        );
      }

      const customerEmail = order.user_id?.email;
      const adminEmail = process.env.ADMIN_ORDER_EMAIL;

      if (!customerEmail) {
        throw new Error(`Missing customer email for order ${order._id}`);
      }

      if (!adminEmail) {
        throw new Error("Missing ADMIN_ORDER_EMAIL environment variable");
      }

      await Promise.all([
        EmailJob.updateOne(
          {
            key: `order:${order._id}:customer`,
          },
          {
            $setOnInsert: {
              key: `order:${order._id}:customer`,
              type: "customer_order_confirmation",
              order_id: order._id,
              to: customerEmail,
              status: "pending",
              next_attempt_at: new Date(),
            },
          },
          {
            upsert: true,
          },
        ),

        EmailJob.updateOne(
          {
            key: `order:${order._id}:admin`,
          },
          {
            $setOnInsert: {
              key: `order:${order._id}:admin`,
              type: "admin_new_order",
              order_id: order._id,
              to: adminEmail,
              status: "pending",
              next_attempt_at: new Date(),
            },
          },
          {
            upsert: true,
          },
        ),
      ]);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;

      const payment = await Payment.findOne({
        stripe_checkout_session_id: session.id,
      });

      if (payment) {
        await cancelOrderAndRestoreStock({
          orderId: payment.order_id,

          allowedStatuses: ["pending"],

          paymentUpdate: {
            payment_status: "expired",
          },
        });
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
