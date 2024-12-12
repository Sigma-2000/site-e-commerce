const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    required: true,
    default: "customer",
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
});
//TODO maybe implement like in Artworks models (for products), orders link to the user
const User = mongoose.model("User", UserSchema);
module.exports = User;
