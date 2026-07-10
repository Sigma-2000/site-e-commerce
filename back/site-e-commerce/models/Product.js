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
  } /*
  reservedStock: [
    {
      quantity: { type: Number, default: 0 },
      expiresAt: { type: Date, default: null },
    },
  ],
});*/,
  //, required: true à mettre quand front et back ok pour cartToken
  reservedStock: [
    {
      cartToken: { type: String },
      quantity: { type: Number, required: true },
      expiresAt: { type: Date, required: true },
    },
  ],
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
