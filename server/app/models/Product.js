const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a product title'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
    },
    category: {
      type: String,
      required: [true, 'Please specify the product category'],
      enum: ['art', 'other'],
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    // You can add more fields as needed, such as product reviews, ratings, etc.
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model('Product', Product);
