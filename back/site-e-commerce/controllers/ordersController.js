const express = require("express");
const Order = require("../models/Order");

const createOrder = async (req, res) => {
  const { user_id, address_id, products, total_price } = req.body;

  try {
    if (!user_id || !address_id || !products || !total_price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    //TODO: add payment when integrate stripe
    const newOrder = await Order.create({
      user_id,
      address_id,
      products,
      total_price,
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
      //.populate("products.id");
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
      error: error.message || "Error occurred while deleting the order.",
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

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
};
