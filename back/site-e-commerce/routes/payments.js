const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  stripeWebhook,
} = require("../controllers/paymentsController");

router.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
