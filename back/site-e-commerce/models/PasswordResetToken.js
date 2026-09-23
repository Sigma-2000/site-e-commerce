const mongoose = require("mongoose");

const { Schema } = mongoose;

const PasswordResetTokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token_hash: {
      type: String,
      required: true,
      unique: true,
    },

    expires_at: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  PasswordResetTokenSchema,
);

module.exports = PasswordResetToken;
