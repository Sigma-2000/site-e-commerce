const express = require("express");
const Order = require("../models/Order");
//link to adresses, user, products populate
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error occurred while retrieving orders",
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
      error: error.message || "Error occurred while retrieving the order.",
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

/* lessons example extract:
const addArtworks = async (req, res) => {
  try {
    const ingredients = JSON.parse(req.body.ingredients);

    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({ message: 'Catégorie invalide.' });
    }

    const recipe = await Recipes.create({
      ...req.body,
      ingredients,
      image: req.file.filename
    });
    res.status(201).json(recipe); //201 création réussie
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur lors de la création de la recette.' });
  }
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const ingredients = JSON.parse(req.body.ingredients);
  
  const updateData = {
    title: req.body.title,
    description: req.body.description,
    instructions: req.body.instructions,
    ingredients,
    category: req.body.category
  };

  // Si une nouvelle image est uploadée
  if (req.file) {
    updateData.image = req.file.filename;
  } else if (req.body.existingImage) {
    // Garder l'image actuelle si pas de changement
    updateData.image = req.body.existingImage;
  }

  try {
    const recipe = await Recipes.findByIdAndUpdate(id, updateData, { new: true }).populate('category');;
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la recette.' });
  }
};*/

module.exports = {
  getAllOrders,
  getOrderById,
  deleteOrderById,
};
