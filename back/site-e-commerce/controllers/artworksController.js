const express = require("express");
const Artwork = require("../models/Artwork");
const { cloudinary } = require("../cloudinary");
const fs = require("fs");

const getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find().populate("products");
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
    const artwork = await Artwork.findById(id).populate("products");

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

const addArtworks = async (req, res) => {
  try {
    if (
      !["painting", "digital art", "photography", "graffiti"].includes(
        req.body.type
      )
    ) {
      return res.status(400).json({ error: "Invalid type provided." });
    }
    const files = req.files;
    const images = [];
    const videos = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
        folder: "artworks",
      });
      if (file.mimetype.startsWith("image/")) {
        images.push(result.secure_url);
      } else if (file.mimetype.startsWith("video/")) {
        videos.push(result.secure_url);
      }
      fs.unlink(file.path, (err) => {
        if (err)
          console.error(
            `Erreur lors de la suppression du fichier ${file.path} :`,
            err
          );
      });
    }
    const artwork = await Artwork.create({
      title: {
        en: req.body.title_en,
        fr: req.body.title_fr,
      },
      type: req.body.type,
      dimensions: req.body.dimensions,
      techniques: {
        en: req.body.techniques_en,
        fr: req.body.techniques_fr,
      },
      description: {
        en: req.body.description_en,
        fr: req.body.description_fr,
      },
      images,
      videos,
    });

    res.status(201).json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload error" });
  }
};

/*lessons example extract:
const updateById = async (req, res) => {
  const { id } = req.params;
  
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
};
*/
module.exports = {
  getAllArtworks,
  getArtworkById,
  deleteArtworkById,
  addArtworks,
};
