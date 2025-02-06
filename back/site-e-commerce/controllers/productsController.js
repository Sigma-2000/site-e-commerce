const express = require("express");
const Product = require("../models/Product");
const Artwork = require("../models/Artwork");
const { cleanExpiredReservations } = require("../utils/productReservation");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("artwork_id");
    for (const product of products) {
      await cleanExpiredReservations(product._id);
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while retrieving products.",
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("artwork_id");
    await cleanExpiredReservations(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({
      error: "Error occurred while retrieving the product.",
    });
  }
};

const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id).populate(
      "artwork_id"
    );

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json({
      message: "Product successfully deleted.",
      deletedProduct,
    });
  } catch (error) {
    console.error("Error in deleteProductById:", error);
    res.status(500).json({
      error: "Error occurred while deleting the product.",
    });
  }
};

const addProduct = async (req, res) => {
  const { artwork_id } = req.params;
  const { price, stock, category } = req.body;
  if (!["print", "original"].includes(category)) {
    return res.status(400).json({ error: "Invalid category provided." });
  }

  try {
    const artwork = await Artwork.findById(artwork_id);
    if (!artwork) {
      return res.status(400).json({ message: "Artwork not found." });
    }

    const product = await Product.create({
      artwork_id,
      price,
      stock,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while creating the product.",
    });
  }
};

const updateProductById = async (req, res) => {
  const { id } = req.params;
  const { price, stock, category } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { price, stock, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product updated successfully.", updatedProduct });
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while updating the product.",
    });
  }
};

const reserveProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insufficient" });
    }
    product.stock -= quantity;
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
    product.reservedStock.push({ quantity, expiresAt });

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error occurred while product reservation" });
  }
};

/**
 * Remove some stock quantity reservation for a product and ensure to take back in stock.
 * We remove the oldest reservation.
 * @route POST /product/:id/remove-reservation
 * @param {string} req.params.id - Product ID.
 * @param {number} req.body.quantity - Quantity to removing from the product reservation.
 * @returns {Object} product - Product stock update after the removing
 *
 */

const removeReservationProductStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.reservedStock.length === 0) {
      return res.status(400).json({
        error: "No reserved stock available to remove.",
      });
    }

    product.reservedStock.sort((a, b) => a.expiresAt - b.expiresAt);

    let quantityToRemove = quantity;
    const reservedTotal = product.reservedStock.reduce(
      (sum, reservation) => sum + reservation.quantity,
      0
    );

    const totalQuantityToRemoveFromReservation = Math.min(
      quantityToRemove,
      reservedTotal
    );

    product.reservedStock = product.reservedStock.filter((reservation) => {
      if (quantityToRemove > 0) {
        const removeFromReservation = Math.min(
          quantityToRemove,
          reservation.quantity
        );
        reservation.quantity -= removeFromReservation;
        quantityToRemove -= removeFromReservation;
      }

      return reservation.quantity > 0;
    });

    product.stock += totalQuantityToRemoveFromReservation;

    await product.save();

    res.status(200).json({
      message: "Stock reservation successfully removed.",
      product,
    });
  } catch (error) {
    console.error("Error in removeReservationProductStock:", error);
    res.status(500).json({
      error: "Error occurred while removing product stock reservation.",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  deleteProductById,
  addProduct,
  updateProductById,
  reserveProductStock,
  removeReservationProductStock,
};
