const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    nickname: { type: String, default: 'Admin' },
    username: { type: String, default: '@admin' },
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  },
);

module.exports = mongoose.model('User', User);
