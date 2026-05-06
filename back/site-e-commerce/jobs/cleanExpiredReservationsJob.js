const cron = require("node-cron");
const { cleanAllExpiredReservations } = require("../utils/productReservation");

const startCleanExpiredReservationsJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const cleanedProductsCount = await cleanAllExpiredReservations();
      console.log(
        `[CRON] Expired reservations cleaned. Products affected: ${cleanedProductsCount}`,
      );
    } catch (error) {
      console.error("[CRON] Error cleaning expired reservations:", error);
    }
  });
};

module.exports = startCleanExpiredReservationsJob;
