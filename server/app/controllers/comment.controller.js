const Comment = require('../models/Comment');
const cloudinary = require('../utils/cloudinary');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    // upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.body.media);
    let newComment = new Comment({
      content: req.body.content,
      commentedBy: req.body.commentedBy,
      art: req.body.art,
      post: req.body.post,
      media: {
        type: req.body.mediaType, //either 'image' or 'video'
        public_id: result.public_id,
        url: result.url,
      },
    });
    let savedComment = await newComment.save();
    res.send(savedComment);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single comment by id
exports.getComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Get all comments from art/post
exports.getComments = async (req, res) => {
  try {
    let comments = await Comment.find({ art: req.params.id });
    if (comments.length < 0) {
      comments = await Comment.find({ post: req.params.id });
    }
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    let comments = await Comment.find().populate(
      'commentedBy',
      'username avatar',
    );
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.media.public_id) {
      // Delete old media from Cloudinary
      await cloudinary.uploader.destroy(comment.media.public_id);
    }

    // Upload new media to Cloudinary
    const result = await cloudinary.uploader.upload(req.body.media);

    // set new media
    comment.media = {
      type: req.body.mediaType, //either 'image' or 'video'
      public_id: result.public_id,
      url: result.url,
    };

    // save comment
    comment.set(req.body);
    let savedComment = await comment.save();

    res.send(savedComment);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).exec();

    // Remove the comment from the parent's reply list
    if (comment.parentCommentId) {
      let parentComment = await Comment.findById(comment.parentCommentId);
      if (parentComment) {
        // find the index where the reply is in parent comment's replies array
        const index = parentComment.replies.indexOf(req.params.id);
        if (index > -1) {
          // delete reply from the array
          parentComment.replies.splice(index, 1);
          await parentComment.save();
        }
      }
    }

    if (comment.media.public_id) {
      await cloudinary.uploader.destroy(comment.media.public_id);
    }

    let result = await Comment.deleteOne({ _id: req.params.id }).exec();
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Like a comment
exports.likeCmt = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    // Check if the user hasn't already liked the comment
    if (!comment.likes.includes(req.body.userId)) {
      comment.likes.push(req.body.userId);
      await comment.save();
      return res.status(200).send(comment);
    } else {
      return res
        .status(400)
        .send({ error: 'You have already liked this comment.' });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Unlike a comment
exports.unlikeCmt = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    // Check if the user has liked the comment before unliking
    const index = comment.likes.indexOf(req.body.userId);
    if (index > -1) {
      comment.likes.splice(index, 1);
      await comment.save();
      return res.status(200).send(comment);
    } else {
      return res
        .status(400)
        .send({ error: 'You have not liked this comment.' });
    }
  } catch (error) {
    return res.status().send(error);
  }
};

// Add reply to comment
exports.addReply = async (req, res) => {
  try {
    // Create a new reply (which is a Comment)
    let replyComment = new Comment({
      content: req.body.content,
      commentedBy: req.user.id, // ID from session or decoded JWT
      parentCommentId: req.params.id, // the original comment ID that you are replying to
      // More fields...
    });
    let savedReply = await replyComment.save();
    res.send(savedReply);
  } catch (error) {
    res.status(500).send(error);
  }
};
