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
} = require("../middlewares/authMiddleware");

router.post("/sign-up", validateRegister, registerUser);
router.post("/login", validateLogin, login);
router.get("/users", verifyToken, getAllUsers); //prof example but usefull in app ? maybe panel admin add middleware admin?
router.get("/user/:id", verifyToken, getOneUser);

module.exports = router;
