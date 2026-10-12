const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  return error;
};

const cancelOrderAndRestoreStock = async ({
  orderId,
  allowedStatuses,
  paymentUpdate = null,
  userId = null,
}) => {
  const session = await mongoose.startSession();

  let result = null;

  try {
    await session.withTransaction(async () => {
      const query = {
        _id: orderId,
      };

      if (userId) {
        query.user_id = userId;
      }

      const order = await Order.findOne(query).session(session);

      if (!order) {
        throw createHttpError(404, "Order not found");
      }

      /*
       * Important :
       * une commande déjà annulée ne doit jamais
       * restaurer son stock une deuxième fois.
       */
      if (order.status_order === "cancelled") {
        result = {
          order,
          alreadyCancelled: true,
        };

        return;
      }

      if (!allowedStatuses.includes(order.status_order)) {
        throw createHttpError(
          409,
          "Order cannot be cancelled in its current status",
        );
      }

      /*
       * Le stock avait été réservé puis consommé
       * par la commande.
       * On le remet donc dans le stock disponible.
       */
      for (const item of order.products) {
        const updateResult = await Product.updateOne(
          {
            _id: item.id,
          },
          {
            $inc: {
              stock: item.quantity,
            },
          },
          {
            session,
          },
        );

        if (updateResult.matchedCount !== 1) {
          throw createHttpError(404, "Product not found while restoring stock");
        }
      }

      order.status_order = "cancelled";

      if (!order.cancelled_at) {
        order.cancelled_at = new Date();
      }

      await order.save({
        session,
      });

      if (order.cart_token) {
        await Cart.findOneAndUpdate(
          {
            token: order.cart_token,
          },
          {
            status: "cancelled",
          },
          {
            session,
          },
        );
      }

      if (order.payment_id && paymentUpdate) {
        await Payment.findByIdAndUpdate(order.payment_id, paymentUpdate, {
          session,
        });
      }

      result = {
        order,
        alreadyCancelled: false,
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  cancelOrderAndRestoreStock,
};
