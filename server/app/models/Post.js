const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: [true, "Please add something"],
      maxLength: 600,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("Post", Post);
