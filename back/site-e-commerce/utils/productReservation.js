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

const handleReservations = (product, orderQuantity, cartToken) => {
  let quantityToConsume = orderQuantity;

  const cartReservations = product.reservedStock
    .filter((reservation) => reservation.cartToken === cartToken)
    .sort((a, b) => a.expiresAt - b.expiresAt);

  for (const reservation of cartReservations) {
    if (quantityToConsume <= 0) break;

    const consumedQuantity = Math.min(quantityToConsume, reservation.quantity);

    reservation.quantity -= consumedQuantity;
    quantityToConsume -= consumedQuantity;
  }

  if (quantityToConsume > 0) {
    throw new Error("Insufficient reserved quantity for this cart");
  }

  product.reservedStock = product.reservedStock.filter(
    (reservation) => reservation.quantity > 0,
  );
};

const cleanExpiredReservationsForProduct = async (product) => {
  const now = new Date();

  const expiredReservations = product.reservedStock.filter(
    (reservation) => reservation.expiresAt && reservation.expiresAt <= now,
  );

  if (!expiredReservations.length) {
    return product;
  }

  const expiredQuantity = expiredReservations.reduce(
    (sum, reservation) => sum + reservation.quantity,
    0,
  );

  product.stock += expiredQuantity;

  product.reservedStock = product.reservedStock.filter(
    (reservation) => reservation.expiresAt && reservation.expiresAt > now,
  );

  await product.save();

  return product;
};

const cleanExpiredReservationsByProductId = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) return null;

  return cleanExpiredReservationsForProduct(product);
};

const cleanAllExpiredReservations = async () => {
  const products = await Product.find();
  s;
  let cleanedProductsCount = 0;

  for (const product of products) {
    if (product.reservedStock && product.reservedStock.length > 0) {
      const expiredReservations = product.reservedStock.filter(
        (reservation) =>
          reservation.expiresAt &&
          new Date(reservation.expiresAt) <= new Date(),
      );

      if (expiredReservations.length > 0) {
        const expiredQuantity = expiredReservations.reduce(
          (sum, reservation) => sum + reservation.quantity,
          0,
        );
        product.stock += expiredQuantity;

        product.reservedStock = product.reservedStock.filter(
          (reservation) => new Date(reservation.expiresAt) > new Date(),
        );

        await product.save();
        cleanedProductsCount++;

        console.log(`Produit ${product._id} nettoyé, stock mis à jour.`);
      }
    } else {
      console.log(`Produit ${product._id} n'a pas de réservations.`);
    }
  }
  return cleanedProductsCount;
};

module.exports = {
  handleReservations,
  cleanExpiredReservationsForProduct,
  cleanExpiredReservationsByProductId,
  cleanAllExpiredReservations,
};
