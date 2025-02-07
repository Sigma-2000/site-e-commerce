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
      error: "Error occurred while retrieving artworks.",
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
      error: "Error occurred while retrieving the artwork.",
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
      error: "Error occurred while deleting the artwork.",
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
    console.log(images);

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
        if (err) console.error(err);
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

const updateArtworkById = async (req, res) => {
  const { id } = req.params;
  const {
    title_en,
    title_fr,
    type,
    dimensions,
    techniques_en,
    techniques_fr,
    description_en,
    description_fr,
  } = req.body;

  try {
    if (
      type &&
      !["painting", "digital art", "photography", "graffiti"].includes(type)
    ) {
      return res.status(400).json({ error: "Invalid type provided." });
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      {
        "title.en": title_en,
        "title.fr": title_fr,
        type,
        dimensions,
        "techniques.en": techniques_en,
        "techniques.fr": techniques_fr,
        "description.en": description_en,
        "description.fr": description_fr,
      },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ error: "Artwork not found." });
    }

    res.json({ message: "Artwork updated successfully.", updatedArtwork });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error occurred while updating the artwork.",
    });
  }
};

module.exports = {
  getAllArtworks,
  getArtworkById,
  deleteArtworkById,
  addArtworks,
  updateArtworkById,
};
