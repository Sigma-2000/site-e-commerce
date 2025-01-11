const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  getAllUsers,
  getOneUser,
  updateUserAddress,
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
router.get("/user/:id", verifyToken, getOneUser); //delete is admin and use it for verify user connection ?
router.put("/user/address", verifyToken, updateUserAddress);

module.exports = router;
