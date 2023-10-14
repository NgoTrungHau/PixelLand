const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Schema = mongoose.Schema;

const Art = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      maxLength: 200,
    },
    description: { type: String, maxLength: 600 },
    art: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    public: { type: Boolean, default: true },
    liked: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

Art.pre('remove', function (next) {
  Comment.deleteMany({ art: this._id }).exec((err) => {
    if (!err) {
      next();
    }
  });
});

module.exports = mongoose.model('Art', Art);
