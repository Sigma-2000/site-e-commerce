const User = require("../models/User");
const Address = require("../models/Address");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, address } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAddress = await Address.create({
      street: address.street,
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address_id: newAddress._id,
    });

    res.status(201).json(user);
  } catch (error) {
    {
      res.status(500).json({ error: "User creation failed" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Authentification failed" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Authentification failed" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        //no password but it can change with the possibility to change password future feat?
      });
  } catch (error) {
    res.status(500).json({ error: "Authentification failed" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("address_id");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: "Error in recovery of users.",
    });
  }
};

const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .populate("address_id")
      .populate({
        path: "orders",
        populate: {
          path: "products.id",
          populate: {
            path: "artwork_id",
            select: "images",
          },
        },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "Error in recovery of the user",
    });
  }
};

const updateUserAddress = async (req, res) => {
  const { street, city, postal_code, country, phone } = req.body;
  try {
    const user = await User.findById(req.user.id).populate("address_id");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.address_id) {
      return res.status(404).json({ error: "Address not found for this user" });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      user.address_id._id,
      { street, city, postal_code, country, phone },
      { new: true }
    );

    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({
      error: "Error updating address",
    });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("address_id");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    if (user.address_id) {
      await Address.findByIdAndDelete(user.address_id._id);
    }
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User successfully deleted.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error occurred while deleting the user.",
    });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
    });
    res.status(200).json({
      message: "User successfully logged out.",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error occurred while logging out.",
    });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Operation failed.",
    });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("token", newAccessToken, {
      httpOnly: true,
    });

    res.status(200).json({ message: "Operation succeed" });
  } catch (error) {
    res.status(401).json({ error: "Operation failed" });
  }
};

module.exports = {
  registerUser,
  login,
  getAllUsers,
  getOneUser,
  updateUserAddress,
  deleteUserById,
  logout,
  refreshToken,
};
