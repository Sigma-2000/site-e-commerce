const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllProducts,
  getProductById,
  deleteProductById,
  addProduct,
  updateProductById,
  reserveProductStock,
  removeReservationProductStock,
} = require("../controllers/productsController");

router.get("/products", getAllProducts);
router.get("/product/:id", getProductById);
router.delete("/product/:id", verifyToken, isAdmin, deleteProductById);
router.post("/product/:artwork_id", verifyToken, isAdmin, addProduct);
router.put("/product/:id", verifyToken, isAdmin, updateProductById);
router.post("/product/:id/reservation", reserveProductStock);
router.post("/product/:id/remove-reservation", removeReservationProductStock);

module.exports = router;
