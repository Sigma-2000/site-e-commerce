const Product = require("../models/Product");

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
