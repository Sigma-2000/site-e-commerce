const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArtworkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
  },
  videos: {
    type: [String],
  },
});

const Artwork = mongoose.model("Artwork", ArtworkSchema);
module.exports = Artwork;
