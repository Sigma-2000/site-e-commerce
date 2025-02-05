const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const validateRegister = async (req, res, next) => {
  const { firstName, lastName, email, password, address } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "User for invalid" });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error:
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  if (
    !address ||
    !address.street ||
    !address.city ||
    !address.postal_code ||
    !address.country ||
    !address.phone
  ) {
    return res.status(400).json({ error: "Address incomplete" });
  }
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(address.phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already used" });
    }

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error checking email/password availability" });
  }
};
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must contain 8 characters" });
  }

  next();
};
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};

module.exports = {
  verifyToken,
  validateRegister,
  validateLogin,
  isAdmin,
};
