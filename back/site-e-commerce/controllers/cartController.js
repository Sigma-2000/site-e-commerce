const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  cleanExpiredReservationsByProductId,
  cleanExpiredReservationsForProduct,
} = require("../utils/productReservation");

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
  if (cart.status !== "active") {
    const error = new Error("Cart is not active anymore");
    error.statusCode = 409;
    error.cartStatus = cart.status;
    throw error;
  }
  cart.expires_at = getCartExpiresAt();
  cart.status = "active";

  return cart;
};

const addToCart = async (req, res) => {
  const { productId } = req.params;
  const { cartToken, quantity } = req.body;

  try {
    if (!productId || !cartToken) {
      return res.status(400).json({ error: "Missing productId or cartToken" });
    }

    await cleanExpiredReservationsByProductId(productId);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

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
      existingReservation.expiresAt = new Date(cart.expires_at);
    } else {
      product.reservedStock.push({
        cartToken,
        quantity,
        expiresAt: new Date(cart.expires_at),
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

    return res.status(error.statusCode || 500).json({
      error: error.message || "Error adding product to cart",
      cartStatus: error.cartStatus,
    });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const { cartToken, quantity } = req.body;

  try {
    if (!productId || !cartToken || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cart = await Cart.findOne({ token: cartToken });
    await cleanExpiredReservationsByProductId(productId);
    const product = await Product.findById(productId);

    if (!cart || !product) {
      return res.status(404).json({ error: "Cart or product not found" });
    }

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

const validateCart = async (req, res) => {
  const { cartToken, cart: frontendCart = [] } = req.body;

  try {
    if (!cartToken) {
      return res.status(400).json({ error: "Missing cartToken" });
    }

    const mongoCart = await Cart.findOne({
      token: cartToken,
      status: "active",
    }).populate({
      path: "items.product_id",
      populate: { path: "artwork_id" },
    });

    if (!mongoCart) {
      return res.status(409).json({
        error: "Cart is not active anymore",
      });
    }

    const updatedCart = [];
    let total_price = 0;

    for (const item of mongoCart.items) {
      const product = item.product_id;

      if (!product) continue;

      await cleanExpiredReservationsForProduct(product);

      const reservation = product.reservedStock.find(
        (reservation) => reservation.cartToken === cartToken,
      );

      if (!reservation || reservation.quantity <= 0) {
        continue;
      }

      const validQuantity = Math.min(item.quantity, reservation.quantity);

      const frontendItem = frontendCart.find(
        (frontendItem) => String(frontendItem.id) === String(product._id),
      );
      const artwork = product.artwork_id;

      updatedCart.push({
        id: product._id,
        image:
          artwork?.images?.[0]?.url ||
          artwork?.images?.[0] ||
          product.image ||
          frontendItem?.image ||
          null,

        title: product.title || artwork?.title || frontendItem?.title || {},

        type: product.type || frontendItem?.type || "",

        price: product.price,
        quantity: validQuantity,
        totalPrice: product.price * validQuantity,
        stock: product.stock,
        message: "Product quantity is valid.",
      });
      total_price += product.price * validQuantity;
    }

    return res.status(200).json({
      updatedCart,
      total_price,
    });
  } catch (error) {
    console.error("validateCart error:", error);

    return res.status(500).json({
      error: "Error occurred while validating the cart.",
      details: error.message,
    });
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
  validateCart,
  getCart,
};
