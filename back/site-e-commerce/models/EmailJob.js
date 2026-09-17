const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmailJobSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["customer_order_confirmation", "admin_new_order"],
      required: true,
    },

    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    to: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed"],
      default: "pending",
    },

    attempts: {
      type: Number,
      default: 0,
    },

    resend_id: {
      type: String,
    },

    last_error: {
      type: String,
    },

    next_attempt_at: {
      type: Date,
      default: Date.now,
    },

    sent_at: {
      type: Date,
    },

    locked_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const EmailJob = mongoose.model("EmailJob", EmailJobSchema);

module.exports = EmailJob;
