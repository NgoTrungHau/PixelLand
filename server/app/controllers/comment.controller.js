const Comment = require('../models/Comment');
const Post = require('../models/Post');

const cloudinary = require('../utils/cloudinary');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    if (!req.body.content && !req.body.media) {
      return res.status(400).send('Either content or media is required.');
    }
    // upload image to cloudinary
    let result;
    if (req.body.media) {
      result = await cloudinary.uploader.upload(req.body.media, {
        folder: 'comments',
      });
    }

    let newComment = new Comment({
      content: req.body.content,
      commentedBy: req.body.commentedBy,
      art: req.body.art,
      post: req.body.post,
      media: result
        ? {
            type: req.body.mediaType, //either 'image' or 'video'
            public_id: result.public_id,
            url: result.url,
          }
        : null,
    });
    let savedComment = await newComment.save();
    let associatedArt = await Post.findById(req.body.post);
    if (associatedArt) {
      associatedArt.comments.push(savedComment._id);
      await associatedArt.save();
    }
    res.json({
      ...savedComment._doc,
      commentedBy: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
      },
    });
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
    let comments = await Comment.find({ art: req.params.id })
      .sort({ createdAt: -1 })
      .populate('commentedBy', 'username avatar');
    if (comments.length < 0) {
      comments = await Comment.find({ post: req.params.id })
        .sort({ createdAt: -1 })
        .populate('commentedBy', 'username avatar');
    }
    comments.map((cmt) => {
      if (cmt.likedBy.includes(req.user._id.toString())) {
        cmt._doc.liked = true;
      }
    });
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
    let result = null;
    if (req.body.media !== null && comment.media.url !== req.body.media) {
      if (comment.media.public_id) {
        // Delete old media from Cloudinary
        await cloudinary.uploader.destroy(comment.media.public_id, {
          folder: 'comments',
        });
      }

      if (req.body.media !== '') {
        // Upload new media to Cloudinary
        result = await cloudinary.uploader.upload(req.body.media, {
          folder: 'comments',
        });

        // set new media
        comment.media = {
          type: req.body.mediaType, //either 'image' or 'video'
          public_id: result.public_id,
          url: result.url,
        };
      } else {
        comment.media = null;
        console.log(comment.media);
      }
    }
    // save comment
    comment.content = req.body.content;
    let savedComment = await comment
      .save()
      .then((savedComment) =>
        savedComment.populate('commentedBy', 'username avatar'),
      );

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
      await cloudinary.uploader.destroy(comment.media.public_id, {
        folder: 'comments',
      });
    }

    let result = await Comment.deleteOne({ _id: req.params.id }).exec();
    // remove cmt_id from post
    let associatedPost = await Post.findById(req.body.post);
    if (associatedPost) {
      // Pull comment._id from the post's comments array
      associatedPost.comments.pull(comment._id);
      await associatedPost.save();
    }
    res.send(req.params.id);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Like a comment
exports.likeCmt = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    // Check if the user hasn't already liked the comment
    if (!comment.likedBy.includes(req.user._id)) {
      comment.likedBy.push(req.user._id);
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
    const index = comment.likedBy.indexOf(req.user._id);
    if (index > -1) {
      comment.likedBy.splice(index, 1);
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
