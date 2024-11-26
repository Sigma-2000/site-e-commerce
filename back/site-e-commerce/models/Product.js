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
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
