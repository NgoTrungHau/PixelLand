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
        'https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=eb6d92&_nc_ohc=FWEVIl3SNvwAX-bFvwR&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfDFgE61wuWUaR0nkwk3IOo7hTQteete-svLoiN6CMwMAQ&oe=647921F8',
    },
    background: {
      type: String,
      maxLength: 300,
      default: '',
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
