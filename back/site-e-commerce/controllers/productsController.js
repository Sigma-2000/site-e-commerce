const express = require("express");
const Product = require("../models/Product");
const Artwork = require("../models/Artwork");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("artwork_id");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error occurred while retrieving products.",
    });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("artwork_id");

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({
      error: error.message || "Error occurred while retrieving the product.",
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
      error: error.message || "Error occurred while deleting the product.",
    });
  }
};

const addProduct = async (req, res) => {
  const { artwork_id, price, stock, category } = req.body;

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
      error: error.message || "Error occurred while creating the product.",
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
      error: error.message || "Error occurred while updating the product.",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  deleteProductById,
  addProduct,
  updateProductById,
};
