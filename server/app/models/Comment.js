const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    content: {
      type: String,
      maxLength: 200,
    },
    commentedBy: {
      // User who commented
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    art: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Art',
      validate: {
        validator: function (v) {
          return !v || !this.post;
        },
        message: 'A comment cannot be associated with both an Art and a Post.',
      },
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      validate: {
        validator: function (v) {
          return !v || !this.art;
        },
        message: 'A comment cannot be associated with both an Art and a Post.',
      },
    },
    media: {
      // Media associated with a comment (either image or video)
      type: {
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
    liked: {
      type: Boolean,
      default: false,
    },
    likedBy: [
      {
        // Users who liked the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    parentCommentId: {
      // If this comment is a reply, who is it replying to?
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replies: [
      {
        // Replies to a comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

module.exports = mongoose.model('Comment', Comment);
