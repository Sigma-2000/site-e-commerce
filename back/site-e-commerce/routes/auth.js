const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  getAllUsers,
  getOneUser,
} = require("../controllers/authController");
const {
  verifyToken,
  validateRegister,
  validateLogin,
  isAdmin,
} = require("../middlewares/authMiddleware");

router.post("/sign-up", validateRegister, registerUser);
router.post("/login", validateLogin, login);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/user/:id", verifyToken, getOneUser);

module.exports = router;
