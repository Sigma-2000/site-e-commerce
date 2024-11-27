const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  artwork_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artwork",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["print", "original"],
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
