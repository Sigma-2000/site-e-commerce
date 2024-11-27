const express = require("express");
const router = express.Router();
//import function from paymentsController
const {
  getAllOrders,
  getOrderById,
  deleteOrderById,
} = require("../controllers/ordersController");

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.delete("/orders/:id", deleteOrderById);
//router.post("/orders", addOrder);
//router.put("/orders/:id", updateById);
//TODO: make road for payments !
module.exports = router;
