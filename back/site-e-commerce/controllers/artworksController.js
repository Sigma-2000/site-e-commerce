const express = require("express");
const Artwork = require("../models/Artwork");

const getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error occurred while retrieving artworks.",
    });
  }
};

const getArtworkById = async (req, res) => {
  const { id } = req.params;
  try {
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found.",
      });
    }

    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error occurred while retrieving the artwork.",
    });
  }
};

const deleteArtworkById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArtwork = await Artwork.findByIdAndDelete(id);

    if (!deletedArtwork) {
      return res.status(404).json({
        message: "Artwork not found.",
      });
    }

    res.status(200).json({
      message: "Artwork successfully deleted.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error occurred while deleting the artwork.",
    });
  }
};

/*lessons example extract:
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
  getAllArtworks,
  getArtworkById,
  deleteArtworkById,
};
