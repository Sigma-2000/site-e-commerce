const Product = require("../models/Product");

const calculateTotalPrice = async (cart) => {
  let totalPrice = 0;

  for (const item of cart) {
    const product = await Product.findById(item.id);
    if (!product) {
      throw new Error(`Product not found.`);
    }
    totalPrice += item.quantity * product.price;
  }

  return totalPrice;
};

module.exports = {
  calculateTotalPrice,
};
