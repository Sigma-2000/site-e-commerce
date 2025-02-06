const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const { handleReservations } = require("../utils/productReservation");
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
  const { user_id, address_id, products } = req.body;

  try {
    if (!user_id || !address_id || !products) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    for (const item of products) {
      const product = await Product.findById(item.id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const reservedTotal = product.reservedStock.reduce(
        (sum, reservation) => sum + reservation.quantity,
        0
      );
      const totalStock = product.stock + reservedTotal;

      if (item.quantity > totalStock) {
        return res
          .status(400)
          .json({ error: "Insufficient stock for product " });
      }

      handleReservations(product, item.quantity);

      await product.save();
    }

    const totalPrice = await calculateTotalPrice(products);

    const newOrder = await Order.create({
      user_id,
      address_id,
      products,
      total_price: totalPrice,
    });
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
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

/**
 * Validate the shopping cart by checking product availability and adjusting quantities if necessary.
 * Calculate the total price.
 * @route POST /cart/validate
 * @param {Object[]} req.body.cart - List of items in the shopping cart.
 * @param {string} req.body.cart[].id - Product ID.
 * @param {string} req.body.cart[].image - Product image URL.
 * @param {string} req.body.cart[].title - Product title.
 * @param {string} req.body.cart[].type - Type of product.
 * @param {number} req.body.cart[].quantity - Requested quantity of the product.
 * @param {number} req.body.cart[].price - Price per unit of the product.
 * @returns {Object} updatedCart, total_price - Response with the updated cart and total price.
 */

const validateCart = async (req, res) => {
  const { cart } = req.body;

  try {
    let updatedCart = [];

    for (const item of cart) {
      const product = await Product.findById(item.id);

      if (!product) {
        updatedCart.push({
          id: item.id,
          message: "This product no longer exists.",
        });
        continue;
      }

      const reservedQuantity = product.reservedStock.reduce(
        (sum, reservation) => sum + reservation.quantity,
        0
      );

      if (reservedQuantity === 0) {
        updatedCart.push({
          id: item.id,
          image: item.image,
          title: item.title,
          message:
            "The requested quantity is not available anymore, we removed it from your cart.",
        });
        continue;
      }

      if (item.quantity > reservedQuantity) {
        updatedCart.push({
          id: item.id,
          image: item.image,
          title: item.title,
          type: item.type,
          quantity: reservedQuantity,
          price: item.price,
          totalPrice: reservedQuantity * item.price,
          message: "Insufficient stock, adjusted to valid your cart.",
        });
        continue;
      }

      updatedCart.push({
        id: item.id,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.quantity * item.price,
        stock: product.stock,
        title: item.title,
        type: item.type,
        message: "Product quantity is valid.",
      });
    }

    const total_price = updatedCart.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );

    res.status(200).json({ updatedCart, total_price });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occurred while validating the cart." });
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
  validateCart,
  cancelOrder,
};
