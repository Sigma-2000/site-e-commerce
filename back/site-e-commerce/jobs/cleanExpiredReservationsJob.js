const cron = require("node-cron");
const {
  cleanAllExpiredReservations,
  debugProductsReservations,
} = require("../utils/productReservation");

const startCleanExpiredReservationsJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const cleanedProductsCount = await cleanAllExpiredReservations();
    } catch (error) {
      console.error("[CRON] Error cleaning expired reservations:", error);
    }
  });
};

module.exports = startCleanExpiredReservationsJob;
