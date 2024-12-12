const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const {
  getAllProducts,
  getProductById,
  deleteProductById,
  addProduct,
} = require("../controllers/productsController");

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.delete("/products/:id", verifyToken, isAdmin, deleteProductById);
router.post("/products", verifyToken, isAdmin, addProduct);
//router.put("/products/:id", updateById);
//road delete, post, put only accessible for Admin (middleware)

module.exports = router;
