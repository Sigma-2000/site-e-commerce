const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  getAllUsers,
  //getOneUser,
  getCurrentUser,
  updateUserAddress,
  //deleteUserById,
  deleteCurrentUser,
  logout,
  refreshToken,
} = require("../controllers/authController");
const {
  verifyToken,
  validateRegister,
  validateLogin,
  isAdmin,
  validateResetPassword,
} = require("../middlewares/authMiddleware");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordResetController");

const {
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require("../middlewares/rateLimiters");

router.post("/sign-up", validateRegister, registerUser);
router.post("/login", validateLogin, login);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/me", verifyToken, getCurrentUser);
router.delete("/me", verifyToken, deleteCurrentUser);
//router.get("/user/:id", verifyToken, getOneUser);
//router.delete("/user/:id", verifyToken, isAdmin, deleteUserById); //à implémenter plus tard
router.put("/user/address", verifyToken, updateUserAddress);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post(
  "/reset-password",
  resetPasswordLimiter,
  validateResetPassword,
  resetPassword,
);

module.exports = router;
