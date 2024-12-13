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
UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user_id",
});

UserSchema.set("toJSON", { virtuals: true });
const User = mongoose.model("User", UserSchema);
module.exports = User;
