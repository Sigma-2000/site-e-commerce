const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  validateCart,
  getCart,
} = require("../controllers/cartController");

router.post("/cart/:productId/add", addToCart);
router.post("/cart/:productId/remove", removeFromCart);
router.post("/cart/validate-cart", validateCart);
router.get("/cart/:cartToken", getCart);

module.exports = router;
