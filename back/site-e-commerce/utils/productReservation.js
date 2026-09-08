const Product = require("../models/Product");
const Cart = require("../models/Cart");
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
/*
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
};*/

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
//refacto pour intégrer logique cart dedans ?
const cleanAllExpiredReservations = async () => {
  const products = await Product.find();
  let cleanedProductsCount = 0;
  const now = new Date();

  for (const product of products) {
    if (product.reservedStock && product.reservedStock.length > 0) {
      const expiredReservations = product.reservedStock.filter(
        (reservation) =>
          reservation.expiresAt && new Date(reservation.expiresAt) <= now,
      );

      if (expiredReservations.length > 0) {
        const expiredQuantity = expiredReservations.reduce(
          (sum, reservation) => sum + reservation.quantity,
          0,
        );
        product.stock += expiredQuantity;
        //ici ajout cart
        for (const reservation of expiredReservations) {
          const cart = await Cart.findOne({
            token: reservation.cartToken,
            status: "active",
          });

          if (!cart) continue;

          cart.items = cart.items
            .map((item) => {
              if (String(item.product_id) !== String(product._id)) {
                return item;
              }

              return {
                ...(item.toObject?.() ?? item),
                quantity: item.quantity - reservation.quantity,
              };
            })
            .filter((item) => item.quantity > 0);

          await cart.save();
        }

        product.reservedStock = product.reservedStock.filter(
          (reservation) => new Date(reservation.expiresAt) > now,
        );

        await product.save();
        cleanedProductsCount++;
      }
    }
  }
  return cleanedProductsCount;
};

module.exports = {
  cleanExpiredReservationsForProduct,
  cleanExpiredReservationsByProductId,
  cleanAllExpiredReservations,
};
