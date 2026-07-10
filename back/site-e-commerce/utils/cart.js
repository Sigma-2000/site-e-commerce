const Product = require("../models/Product");
const Cart = require("../models/Cart");

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

const cleanExpiredCarts = async () => {
  const now = new Date();
  const carts = await Cart.find({ status: "active" });

  let cleanedCartsCount = 0;

  for (const cart of carts) {
    if (!cart.expires_at) continue;

    if (cart.expires_at <= now) {
      cart.status = "expired";
      cart.items = [];

      await cart.save();
      cleanedCartsCount++;
    }
  }

  return cleanedCartsCount;
};

module.exports = {
  calculateTotalPrice,
  cleanExpiredCarts,
};
