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
    enum: ["painting", "digital art", "photography", "graffiti"],
  },
  //TODO add technique like video, live painting, monotype, techniques mixtes
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
