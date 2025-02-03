const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
//import function from paymentsController

const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
  validateCart,
} = require("../controllers/ordersController");

router.post("/order", verifyToken, createOrder);
router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.get("/order/:id", verifyToken, getOrderById);
router.delete("/order/:id", verifyToken, deleteOrderById);
router.put("/order/:id", verifyToken, isAdmin, updateStatusOrderById);
router.post("/order/validate-cart", validateCart);

//TODO: make road for payments !
module.exports = router;
