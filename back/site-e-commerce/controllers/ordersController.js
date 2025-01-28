const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { handleReservations } = require("../utils/productReservation");
const { calculateTotalPrice } = require("../utils/cart");

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

    //TODO: add payment when integrate stripe

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

const validateCart = async (req, res) => {
  const { cart } = req.body;

  try {
    const updatedCart = [];

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

      if (item.quantity > reservedQuantity) {
        updatedCart.push({
          id: item.id,
          message: "The requested quantity is not available anymore.",
        });
        continue;
      }

      updatedCart.push({
        id: item.id,
        message: "Product quantity is valid.",
      });
    }
    const total_price = await calculateTotalPrice(cart);

    res.status(200).json({ updatedCart, total_price });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occurred while validating the cart." });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
  validateCart,
};
