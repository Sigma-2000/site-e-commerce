const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArtworkSchema = new Schema({
  title: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
  },
  type: {
    type: String,
    required: true,
    enum: ["painting", "digital art", "photography", "graffiti"],
  },
  dimensions: {
    type: String,
  },
  techniques: {
    en: { type: String },
    fr: { type: String },
  },
  description: {
    en: { type: String },
    fr: { type: String },
  },
  images: {
    type: [String],
  },
  videos: {
    type: [String],
  },
});

ArtworkSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "artwork_id",
});

ArtworkSchema.set("toJSON", { virtuals: true });

const Artwork = mongoose.model("Artwork", ArtworkSchema);
module.exports = Artwork;
