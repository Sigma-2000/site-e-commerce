const User = require("../models/User");
const Address = require("../models/Address");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, address } = req.body;

  try {
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
      res.status(500).json({ error: error.message || "User creation failed" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select("+password")
      .populate("address_id");

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
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        address_id: user.address_id,
        //no password but it can change with the possibility to change password future feat?
      });
  } catch (error) {
    res.status(500).json({ error: error.message || "Authentification failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("address_id");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error in recovery of users.",
    });
  }
};

/*recovery adress of the user it's for admin to be able to send the order with the right adress,*/
const getOneUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .populate("address_id")
      .populate("orders");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Error in recovery of the user",
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
      error: error.message || "Error updating address",
    });
  }
};

module.exports = {
  registerUser,
  login,
  getAllUsers,
  getOneUser,
  updateUserAddress,
};
