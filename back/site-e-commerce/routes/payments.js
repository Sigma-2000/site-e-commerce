const express = require("express");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

const { createCheckoutSession } = require("../controllers/paymentsController");

router.post("/create-checkout-session", verifyToken, createCheckoutSession);

module.exports = router;
