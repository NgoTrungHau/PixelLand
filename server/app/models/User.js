const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: [true, 'Please add a name'] },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: [true, 'Email already in use'],
    },
    password: { type: String, required: [true, 'Please add a password'] },
    nickname: { type: String, default: '@username' },
    role: { type: String, default: 'user' },
    bio: { type: String, maxLength: 600 },
    avatar: {
      type: String,
      maxLength: 300,
      default:
        'https://cdn.pixilart.com/images/user/profile/large/1b3b80606abab6f.webp?v=1677879129',
    },
    followings: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    liked: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

module.exports = mongoose.model('User', User);
