const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        // You can include additional information specific to the order, such as quantity or price at the time of purchase.
      },
    ],
    totalPaid: {
      type: Number,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Order', Order);
