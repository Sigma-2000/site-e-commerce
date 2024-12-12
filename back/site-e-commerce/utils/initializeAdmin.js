const bcrypt = require("bcrypt");
const User = require("../models/User");
const Address = require("../models/Address");

const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const adminAddress = await Address.create({
        street: "74 quai Joseph Gillet",
        city: "LYON",
        postal_code: "69004",
        country: "FRANCE",
        phone: "1234567890",
      });

      const hashedPassword = await bcrypt.hash(
        "I delete that for security",
        10
      );

      await User.create({
        firstName: "Amélie",
        lastName: "Guyot",
        email: "amelieguyot7@gmail.com",
        password: hashedPassword,
        role: "admin",
        address_id: adminAddress._id,
      });

      console.log("Admin user created");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error initializing admin user:");
  }
};

module.exports = initializeAdmin;
