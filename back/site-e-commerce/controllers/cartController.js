const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { cleanExpiredReservations } = require("../utils/productReservation");
//await cleanExpiredReservationsForProduct(product); //le jobs
const CART_DURATION_MS = 30 * 60 * 1000;

const getCartExpiresAt = () => new Date(Date.now() + CART_DURATION_MS);

const getOrCreateCart = async (cartToken) => {
  let cart = await Cart.findOne({ token: cartToken });

  if (!cart) {
    cart = await Cart.create({
      token: cartToken,
      items: [],
      expires_at: getCartExpiresAt(),
    });
  }

  cart.expires_at = getCartExpiresAt();
  cart.status = "active";

  return cart;
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1, cartToken } = req.body;

  try {
    if (!productId || !cartToken) {
      return res.status(400).json({ error: "Missing productId or cartToken" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await cleanExpiredReservations(product);

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insufficient" });
    }

    const cart = await getOrCreateCart(cartToken);

    const existingItem = cart.items.find(
      (item) => String(item.product_id) === String(productId),
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product_id: productId,
        quantity,
      });
    }

    product.stock -= quantity;

    const existingReservation = product.reservedStock.find(
      (reservation) => reservation.cartToken === cartToken,
    );

    if (existingReservation) {
      existingReservation.quantity += quantity;
      existingReservation.expiresAt = cart.expires_at;
    } else {
      product.reservedStock.push({
        cartToken,
        quantity,
        expiresAt: cart.expires_at,
      });
    }

    await product.save();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product_id",
      populate: { path: "artwork_id" },
    });

    return res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ error: "Error adding product to cart" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId, quantity, cartToken } = req.body;

  try {
    if (!productId || !cartToken || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({ token: cartToken });
    const product = await Product.findById(productId);

    if (!cart || !product) {
      return res.status(404).json({ error: "Cart or product not found" });
    }

    await cleanExpiredReservations(product);

    const cartItem = cart.items.find(
      (item) => String(item.product_id) === String(productId),
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Product not in cart" });
    }

    const quantityToRemove = Math.min(quantity, cartItem.quantity);

    cartItem.quantity -= quantityToRemove;

    if (cartItem.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => String(item.product_id) !== String(productId),
      );
    }

    const reservation = product.reservedStock.find(
      (r) => r.cartToken === cartToken,
    );

    if (reservation) {
      const restoredQuantity = Math.min(quantityToRemove, reservation.quantity);

      reservation.quantity -= restoredQuantity;
      product.stock += restoredQuantity;

      product.reservedStock = product.reservedStock.filter(
        (r) => r.quantity > 0,
      );
    }

    await product.save();
    await cart.save();

    return res.status(200).json({ cart });
  } catch (error) {
    console.error("removeFromCart error:", error);
    return res.status(500).json({ error: "Error removing product from cart" });
  }
};

const getCart = async (req, res) => {
  const { cartToken } = req.params;

  try {
    const cart = await Cart.findOne({ token: cartToken }).populate({
      path: "items.product_id",
      populate: { path: "artwork_id" },
    });

    if (!cart) {
      return res.status(200).json({ cart: null, total_price: 0 });
    }

    let total_price = 0;

    for (const item of cart.items) {
      total_price += item.product_id.price * item.quantity;
    }

    return res.status(200).json({ cart, total_price });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({ error: "Error retrieving cart" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
