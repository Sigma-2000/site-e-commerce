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

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
  validateCart,
};
