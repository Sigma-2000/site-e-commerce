const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/cartController");

router.post("/cart/add", addToCart);
router.post("/cart/remove", removeFromCart);
router.get("/cart/:cartToken", getCart);

module.exports = router;
