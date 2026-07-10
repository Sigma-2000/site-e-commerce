const cron = require("node-cron");
const {
  cleanAllExpiredReservations,
  debugProductsReservations,
} = require("../utils/productReservation");
const { cleanExpiredCarts } = require("../utils/cart");

const startCleanExpiredReservationsJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const cleanedProductsCount = await cleanAllExpiredReservations();
    } catch (error) {
      console.error("[CRON] Error cleaning expired reservations:", error);
    }
    try {
      const cleanedCartsCount = await cleanExpiredCarts();

      console.log(`[CRON] ${cleanedCartsCount} carts expired`);
    } catch (error) {
      console.error("[CRON] Error cleaning expired carts:", error);
    }
  });
};
//créer des crons pour effacer les vielles cartes expiré, commandé..
module.exports = startCleanExpiredReservationsJob;
