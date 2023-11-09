const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: 25,
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please add an email'],
      unique: [true, 'Email already in use'],
    },
    password: { type: String, required: [true, 'Please add a password'] },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    refresh_token: { type: String, default: '' },
    description: { type: String, maxLength: 600, default: 'Hello' },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    background: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

module.exports = mongoose.model('User', User);
