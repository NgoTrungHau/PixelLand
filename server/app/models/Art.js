const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Art = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: { type: String, maxLength: 600 },
    art: {
      type: String,
      maxLength: 300,
      required: true,
      default: 'https://art.pixilart.com/sr2fdbf6ae4d23d.png',
    },
    liked: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

module.exports = mongoose.model('Art', Art);
