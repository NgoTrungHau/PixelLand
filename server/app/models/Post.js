const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: [true, 'Please add something'],
      maxLength: 600,
    },
    media: {
      // Media associated with a comment (either image or video)
      type: {
        type: String,
        enum: ['image', 'video'], // The media can be either an image or a video
      },
      public_id: {
        type: String,
      },
      url: {
        type: String,
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

Post.pre('remove', function (next) {
  Comment.deleteMany({ art: this._id }).exec((err) => {
    if (!err) {
      next();
    }
  });
});

module.exports = mongoose.model('Post', Post);
