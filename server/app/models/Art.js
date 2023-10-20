const mongoose = require('mongoose');
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
    approved: {
      type: Boolean,
      default: true,
    },
    privacy: {
      type: String,
      enum: ['Public', 'Only me', 'Followers only', 'Members only'],
      required: true,
      default: 'Public',
    },
    style: {
      type: String,
      enum: [
        'Digital Painting',
        'Fan Art',
        'Concept Art',
        'Fantasy Art',
        'Aesthetic Art',
        'Pixel Art',
        'Vector Art',
        'Game Art',
        'AI Art',
        'Anime and Manga',
      ],
      required: true,
      default: true,
    },
    liked: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

module.exports = mongoose.model('Art', Art);
