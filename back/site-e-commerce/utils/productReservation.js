const Product = require("../models/Product");
/**
 * Adjusts product reservations when we have an order.
 * It remove the ordered quantity from the oldest reserved stock.
 * If the reserved stock is insufficient, the remaining quantity is removed from the actual stock.
 *
 * @param {Object} product - The product object stock and reservations need adjustment.
 * @param {Array} product.reservedStock - Array of stock reservations, sorted by expiration date.
 * @param {number} product.stock - Current available stock for the product.
 * @param {number} orderQuantity - The quantity of the product being ordered.
 */

const handleReservations = (product, orderQuantity) => {
  product.reservedStock.sort((a, b) => a.expiresAt - b.expiresAt);

  for (const reservation of product.reservedStock) {
    if (orderQuantity <= 0) break;

    const removeFromReservation = Math.min(orderQuantity, reservation.quantity);
    reservation.quantity -= removeFromReservation;
    orderQuantity -= removeFromReservation;
  }

  product.reservedStock = product.reservedStock.filter(
    (reservation) => reservation.quantity > 0
  );

  if (orderQuantity > 0) {
    product.stock -= orderQuantity;
  }
};

const cleanExpiredReservations = async (productId) => {
  const now = new Date();
  try {
    const product = await Product.findById(productId);

    if (!product) return;

    const expiredReservations = product.reservedStock.filter(
      (reservation) => reservation.expiresAt && reservation.expiresAt <= now
    );

    const expiredQuantity = expiredReservations.reduce(
      (sum, res) => sum + res.quantity,
      0
    );

    product.stock += expiredQuantity;

    product.reservedStock = product.reservedStock.filter(
      (reservation) => reservation.expiresAt && reservation.expiresAt > now
    );

    await product.save();
  } catch (error) {
    console.error("Error cleaning reservations ");
  }
};
module.exports = {
  handleReservations,
  cleanExpiredReservations,
};
