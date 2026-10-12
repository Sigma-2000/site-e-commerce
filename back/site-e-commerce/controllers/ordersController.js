const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const {
  cancelOrderAndRestoreStock,
} = require("../services/orderCancellationService");

const {
  cleanExpiredReservationsForProduct,
} = require("../utils/productReservation");
const { calculateTotalPrice } = require("../utils/cart");

const { sendEmail } = require("../services/emailService");

const {
  buildOrderShippedEmail,
} = require("../services/templates/orderShippedEmail");

/**
 * Create a new order, verify product stock, remove the ordered quantity in oldest reservation and then stock if it's needed
 * Calculate the total price.
 * @route POST /order
 * @param {string} req.body.user_id - ID of the user who asking for the order.
 * @param {string} req.body.address_id - ID of the user's shipping address.
 * @param {Object[]} req.body.products - List of products in the order.
 * @param {string} req.body.products[].id - Product ID.
 * @param {number} req.body.products[].quantity - Quantity ordered.
 * @returns {Object} order - Response confirming the order creation with all informations.
 *
 */

const createOrder = async (req, res) => {
  const { address_id, cartToken, shipping_method } = req.body;
  const user_id = req.user.id;
  console.log("BODY", req.body);

  try {
    if (!user_id || !address_id || !cartToken) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({
      token: cartToken,
      status: "active",
    }).populate("items.product_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty or expired" });
    }

    const orderProducts = [];
    let totalPrice = 0;

    const SHIPPING_PRICES = {
      pickup_lyon: 0,
      colissimo_signature: 8,
    }; //déplacer cette variable magic string

    const shippingPrice = SHIPPING_PRICES[shipping_method];

    if (shippingPrice === undefined) {
      return res.status(400).json({ error: "Invalid shipping method" });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product_id._id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      try {
        await cleanExpiredReservationsForProduct(product);
      } catch (cleanError) {
        console.error("cleanExpiredReservationsForProduct error:", cleanError);

        return res.status(500).json({
          error: "Error while validating product reservations",
        });
      }
      const reservation = product.reservedStock.find(
        (r) => r.cartToken === cartToken,
      );

      if (!reservation || reservation.quantity < item.quantity) {
        return res.status(400).json({
          error: "Reservation expired or insufficient",
        });
      }

      reservation.quantity -= item.quantity;

      product.reservedStock = product.reservedStock.filter(
        (r) => r.quantity > 0,
      );

      await product.save();

      orderProducts.push({
        id: product._id,
        quantity: item.quantity,
      });

      totalPrice += product.price * item.quantity;
    }

    const newOrder = await Order.create({
      user_id,
      address_id,
      products: orderProducts,
      total_price: totalPrice + shippingPrice,
      shipping_method,
      shipping_price: shippingPrice,
      cart_token: cartToken,
      status_order: "pending",
    });
    cart.status = "checkout_pending";

    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    console.error(error.stack);
    return res.status(500).json({ error: "Error creating order" });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id")
      .populate("address_id")
      .populate("payment_id")
      .populate({
        path: "products.id",
        populate: {
          path: "artwork_id",
          select: "images",
        },
      });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while retrieving orders",
    });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while retrieving the order.",
    });
  }
};

const deleteOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json({
      message: "Order successfully deleted.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while deleting the order.",
    });
  }
};
const updateStatusOrderById = async (req, res) => {
  const { id } = req.params;

  const { status_order, tracking_number } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    if (order.status_order === "cancelled") {
      return res.status(409).json({
        error: "Cancelled orders cannot be updated",
      });
    }

    const validStatuses = ["pending", "shipped", "delivered"];

    if (!validStatuses.includes(status_order)) {
      return res.status(400).json({
        error: "Invalid status provided",
      });
    }

    // Une commande en retrait n'est pas expédiée.
    if (order.shipping_method === "pickup_lyon" && status_order === "shipped") {
      return res.status(400).json({
        error: "Pickup orders cannot be marked as shipped",
      });
    }

    const normalizedTrackingNumber = tracking_number?.trim() || "";

    // Le numéro est obligatoire au moment où
    // un Colissimo passe en "shipped".
    if (
      status_order === "shipped" &&
      order.shipping_method === "colissimo_signature" &&
      !normalizedTrackingNumber
    ) {
      return res.status(400).json({
        error: "Tracking number required",
      });
    }

    const shouldSendShippingEmail =
      order.status_order !== "shipped" &&
      status_order === "shipped" &&
      order.shipping_method === "colissimo_signature" &&
      !order.shipped_at;

    order.status_order = status_order;

    if (
      status_order === "shipped" &&
      order.shipping_method === "colissimo_signature"
    ) {
      order.tracking_number = normalizedTrackingNumber;

      if (!order.shipped_at) {
        order.shipped_at = new Date();
      }
    }

    if (status_order === "delivered" && !order.delivered_at) {
      order.delivered_at = new Date();
    }

    await order.save();

    let emailSent = null;

    if (shouldSendShippingEmail) {
      try {
        await order.populate("user_id");

        const html = buildOrderShippedEmail({
          order,
        });

        await sendEmail({
          to: order.user_id.email,
          subject: "Votre commande SIGMA.2000 a été expédiée",
          html,
        });

        emailSent = true;
      } catch (emailError) {
        emailSent = false;

        console.error("Order shipped email error:", emailError);
      }
    }

    return res.status(200).json({
      message: "Order status updated",
      order,
      email_sent: emailSent,
    });
  } catch (error) {
    console.error("updateStatusOrderById error:", error);

    return res.status(500).json({
      error: "Error updating order status",
    });
  }
};
/*
const cancelOrder = async (req, res) => {
  const { order_id } = req.body;
  try {
    if (!order_id) {
      return res.status(400).json({ error: "Missing order_id" });
    }

    const order = await Order.findById(order_id).populate("products.id");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status_order === "cancelled") {
      return res.status(200).json({
        message: "Order already cancelled",
      });
    }
    if (
      order.status_order === "shipped" ||
      order.status_order === "delivered"
    ) {
      return res.status(400).json({
        error: "Shipped or delivered orders cannot be cancelled",
      });
    }
    // Temporaire :
    // sera remplacé par le remboursement Stripe.
    if (order.status_order === "paid") {
      return res.status(409).json({
        error: "Paid order requires a refund before cancellation",
      });
    }

    for (const item of order.products) {
      const product = item.id;
      product.stock += item.quantity;
      await product.save();
    }

    order.status_order = "cancelled";
    await order.save();

    await Cart.findOneAndUpdate(
      { token: order.cart_token },
      { status: "cancelled" },
    );

    if (order.payment_id) {
      await Payment.findByIdAndUpdate(order.payment_id, {
        payment_status: "failed",
      });
    }

    return res.json({
      message: "Order and payment successfully cancelled. Stock restored.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel order" });
  }
};*/
const cancelOrder = async (req, res) => {
  const { order_id } = req.body;

  try {
    if (!order_id) {
      return res.status(400).json({
        error: "Missing order_id",
      });
    }

    const result = await cancelOrderAndRestoreStock({
      orderId: order_id,

      // Cette route concerne uniquement
      // un checkout qui n'a pas été payé.
      allowedStatuses: ["pending"],

      // L'utilisateur ne peut annuler
      // que sa propre commande.
      userId: req.user.id,

      paymentUpdate: {
        payment_status: "cancelled",
      },
    });

    if (result.alreadyCancelled) {
      return res.status(200).json({
        message: "Order already cancelled",
      });
    }

    return res.status(200).json({
      message: "Order successfully cancelled. Stock restored.",
    });
  } catch (error) {
    console.error("cancelOrder error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to cancel order",
    });
  }
};
const refundAndCancelOrderByAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    /*
     * Déjà annulée :
     * surtout ne pas rembourser/restocker deux fois.
     */
    if (order.status_order === "cancelled") {
      return res.status(200).json({
        message: "Order already cancelled",
      });
    }

    /*
     * Une commande expédiée/livrée n'est plus
     * une simple annulation.
     * Ce serait un retour/remboursement V4.
     */
    if (
      order.status_order === "shipped" ||
      order.status_order === "delivered"
    ) {
      return res.status(409).json({
        error: "Shipped or delivered orders cannot be cancelled",
      });
    }

    /*
     * Cette route admin est exclusivement
     * destinée aux commandes réellement payées.
     */
    if (order.status_order !== "paid") {
      return res.status(409).json({
        error: "Only paid orders can be refunded",
      });
    }

    if (!order.payment_id) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    const payment = await Payment.findById(order.payment_id);

    if (!payment) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    if (!payment.payment_intent_id) {
      return res.status(400).json({
        error: "Missing Stripe PaymentIntent",
      });
    }

    let refund;

    /*
     * Si un remboursement Stripe existe déjà,
     * on récupère celui-ci au lieu d'en créer
     * un autre.
     */
    if (payment.stripe_refund_id) {
      refund = await stripe.refunds.retrieve(payment.stripe_refund_id);
    } else {
      refund = await stripe.refunds.create(
        {
          payment_intent: payment.payment_intent_id,

          metadata: {
            order_id: String(order._id),
          },
        },
        {
          idempotencyKey: `order-refund:${order._id}`,
        },
      );

      /*
       * On mémorise tout de suite le refund Stripe.
       * Ainsi, si la suite échoue, le prochain essai
       * retrouvera le même remboursement.
       */
      await Payment.findByIdAndUpdate(payment._id, {
        stripe_refund_id: refund.id,
        refund_status: refund.status,
      });
    }

    /*
     * Si Stripe n'a pas encore terminé
     * le remboursement, on ne touche pas encore
     * au stock ni à la commande.
     */
    if (refund.status !== "succeeded") {
      await Payment.findByIdAndUpdate(payment._id, {
        refund_status: refund.status,
      });

      return res.status(202).json({
        message: "Refund is processing",
        refund_status: refund.status,
      });
    }

    /*
     * Stripe a remboursé :
     * maintenant seulement on annule la commande
     * et on restaure le stock.
     */
    const cancellation = await cancelOrderAndRestoreStock({
      orderId: order._id,

      allowedStatuses: ["paid"],

      paymentUpdate: {
        payment_status: "refunded",
        stripe_refund_id: refund.id,
        refund_status: refund.status,
        refunded_at: new Date(),
      },
    });

    return res.status(200).json({
      message: "Order successfully refunded and cancelled",
      order: cancellation.order,
      refund_id: refund.id,
    });
  } catch (error) {
    console.error("refundAndCancelOrderByAdmin error:", error);

    return res.status(error.statusCode || 500).json({
      error: error.message || "Failed to refund and cancel order",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
  //validateCart,
  cancelOrder,
  refundAndCancelOrderByAdmin,
};
