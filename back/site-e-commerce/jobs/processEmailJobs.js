const cron = require("node-cron");
const mongoose = require("mongoose");
const EmailJob = require("../models/EmailJob");
const Order = require("../models/Order");

const { sendEmail } = require("../services/emailService");

const {
  buildOrderConfirmationEmail,
} = require("../services/templates/orderConfirmation");

const {
  buildAdminNewOrderEmail,
} = require("../services/templates/adminNewOrder");

let isProcessing = false;
const claimNextJob = async () => {
  const now = new Date();

  const staleLock = new Date(Date.now() - 10 * 60 * 1000);

  return EmailJob.findOneAndUpdate(
    {
      attempts: mongoose.trusted({
        $lt: 5,
      }),

      $or: [
        {
          status: mongoose.trusted({
            $in: ["pending", "failed"],
          }),

          next_attempt_at: mongoose.trusted({
            $lte: now,
          }),
        },

        {
          status: "processing",

          locked_at: mongoose.trusted({
            $lte: staleLock,
          }),
        },
      ],
    },

    {
      $set: {
        status: "processing",
        locked_at: now,
      },

      $inc: {
        attempts: 1,
      },
    },

    {
      new: true,
      sort: { createdAt: 1 },
    },
  );
};

const processJob = async (job) => {
  try {
    const order = await Order.findById(job.order_id)
      .populate("user_id")
      .populate("address_id")
      .populate({
        path: "products.id",
        populate: {
          path: "artwork_id",
          select: "title images",
        },
      });

    if (!order) {
      throw new Error(`Order ${job.order_id} not found`);
    }

    let subject;
    let html;

    if (job.type === "customer_order_confirmation") {
      subject = "Confirmation de votre commande SIGMA.2000";

      html = buildOrderConfirmationEmail({
        order,
      });
    }

    if (job.type === "admin_new_order") {
      subject = `Nouvelle commande SIGMA.2000 — ${order._id}`;

      html = buildAdminNewOrderEmail({
        order,
      });
    }

    if (!subject || !html) {
      throw new Error(`Unknown email job type: ${job.type}`);
    }

    const result = await sendEmail({
      to: job.to,
      subject,
      html,
      idempotencyKey: job.key,
    });

    await EmailJob.findByIdAndUpdate(job._id, {
      status: "sent",
      sent_at: new Date(),
      resend_id: result?.id || null,
      last_error: null,
      locked_at: null,
    });
  } catch (error) {
    console.error("Email job failed:", error);

    const retryDelay = Math.min(
      5 * 60 * 1000 * 2 ** (job.attempts - 1),
      60 * 60 * 1000,
    );

    await EmailJob.findByIdAndUpdate(job._id, {
      status: "failed",
      last_error: error.message,
      locked_at: null,
      next_attempt_at: new Date(Date.now() + retryDelay),
    });
  }
};

const processEmailJobs = async () => {
  if (isProcessing) {
    return;
  }

  isProcessing = true;

  try {
    for (let i = 0; i < 10; i += 1) {
      const job = await claimNextJob();

      if (!job) {
        break;
      }

      await processJob(job);
    }
  } finally {
    isProcessing = false;
  }
};

const startProcessEmailJobs = () => {
  cron.schedule("* * * * *", processEmailJobs);
};

module.exports = startProcessEmailJobs;
