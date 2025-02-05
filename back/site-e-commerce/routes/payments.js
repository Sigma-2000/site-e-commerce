const express = require("express");
const router = express.Router();
const {
  createPayment,
  confirmPayment,
} = require("../controllers/paymentsController");

router.post("/create-checkout-session", createPayment);
router.post("/confirm-payment", confirmPayment);

module.exports = router;
