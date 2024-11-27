const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    required: true,
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
