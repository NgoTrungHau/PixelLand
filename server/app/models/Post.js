const mongoose = require('mongoose');
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
      maxLength: 600,
    },
    media: {
      // Media associated with a comment (either image or video)
      mediaType: {
        type: String,
        enum: ['image', 'video', null], // The media can be either an image or a video
      },
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    privacy: {
      type: String,
      enum: ['Public', 'Only me', 'Followers only', 'Members only'],
      required: true,
      default: 'Public',
    },
    liked: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);
module.exports = mongoose.model('Post', Post);
