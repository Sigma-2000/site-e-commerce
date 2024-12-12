const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
//import function from paymentsController

const {
  getAllOrders,
  getOrderById,
  deleteOrderById,
} = require("../controllers/ordersController");

router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.get("/orders/:id", verifyToken, getOrderById);
router.delete("/orders/:id", verifyToken, isAdmin, deleteOrderById);
//router.post("/orders", addOrder);
//router.put("/orders/:id", updateById);
//TODO: make road for payments !
module.exports = router;
