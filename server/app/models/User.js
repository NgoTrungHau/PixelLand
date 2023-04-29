const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: 25,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Please add an email'],
      unique: [true, 'Email already in use'],
    },
    password: { type: String, required: [true, 'Please add a password'] },
    role: { type: String, default: 'user' },
    bio: { type: String, maxLength: 600, default: 'Hello' },
    avatar: {
      type: String,
      maxLength: 300,
      default:
        'https://cdn.pixilart.com/images/user/profile/large/1b3b80606abab6f.webp?v=1677879129',
    },
    background: {
      type: String,
      maxLength: 300,
      default:
        'https://c4.wallpaperflare.com/wallpaper/406/189/125/digital-art-pixel-art-pixelated-pixels-wallpaper-preview.jpg',
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
