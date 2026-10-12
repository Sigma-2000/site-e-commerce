const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrderById,
  updateStatusOrderById,
  cancelOrder,
  refundAndCancelOrderByAdmin,
} = require("../controllers/ordersController");

router.post("/order", verifyToken, createOrder);
router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.get("/order/:id", verifyToken, getOrderById);
router.delete("/order/:id", verifyToken, deleteOrderById);
router.put("/order/:id", verifyToken, isAdmin, updateStatusOrderById);
router.post("/cancel-order", verifyToken, cancelOrder);
router.post(
  "/admin/order/:id/refund",
  verifyToken,
  isAdmin,
  refundAndCancelOrderByAdmin,
);
/*router.post("/admin/order/:id/cancel", verifyToken, isAdmin, cancelOrder);*/

module.exports = router;
