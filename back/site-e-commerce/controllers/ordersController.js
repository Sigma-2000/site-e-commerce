const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");

const {
  cleanExpiredReservationsForProduct,
} = require("../utils/productReservation");
const { calculateTotalPrice } = require("../utils/cart");

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
  const { status_order } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status_order)) {
      return res.status(400).json({ error: "Invalid status provided" });
    }

    order.status_order = status_order;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: "Error updating order status" });
  }
};

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
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
  //validateCart,
  cancelOrder,
};
