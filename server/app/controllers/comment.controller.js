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
    const query = {
      $and: [
        { $or: [{ art: req.params.id }, { post: req.params.id }] },
        { parentCommentId: { $exists: false } },
      ],
    };
    let comments = await Comment.find(query)
      .populate('commentedBy', 'username avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'commentedBy',
          select: 'username avatar',
        },
      });

    comments = comments.map((cmt) => {
      cmt._doc.liked = cmt.likedBy.includes(req.user._id.toString());
      cmt._doc.replies.map(
        (reply) =>
          (reply._doc.liked = reply.likedBy.includes(req.user._id.toString())),
      );
      return cmt;
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
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    if (req.body.media === '' && comment.media && comment.media.url) {
      // Delete the old media and set the comment media to null
      if (comment.media.public_id) {
        await cloudinary.uploader.destroy(comment.media.public_id);
      }
      comment.media = null;
    } else if (req.body.media !== '' && comment.media.url !== req.body.media) {
      // Delete the old media and upload the new media
      let destroyOld = comment.media.public_id
        ? cloudinary.uploader.destroy(comment.media.public_id)
        : Promise.resolve();
      let uploadNew = cloudinary.uploader.upload(req.body.media, {
        folder: 'comments',
      });

      let [_, result] = await Promise.all([destroyOld, uploadNew]);

      comment.media = {
        type: req.body.mediaType, //either 'image' or 'video'
        public_id: result.public_id,
        url: result.url,
      };
    }

    // save comment
    comment.content = req.body.content;

    let savedComment = await comment.save();
    savedComment = await savedComment.populate(
      'commentedBy',
      'username avatar',
    );

    if (savedComment.replies) {
      savedComment = await savedComment.populate({
        path: 'replies',
        populate: { path: 'commentedBy', select: 'username avatar' },
      });
    }

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

    // Delete all replies of comment
    if (comment.replies && comment.replies.length > 0) {
      let replies = await Comment.find({ parentCommentId: comment._id });
      // Delete media of all replies
      for (let reply of replies) {
        if (reply.media && reply.media.public_id) {
          await cloudinary.uploader.destroy(reply.media.public_id);
        }
      }
      // Delete all replies
      await Comment.deleteMany({ parentCommentId: comment._id });
    }

    if (comment.media.public_id) {
      await cloudinary.uploader.destroy(comment.media.public_id, {
        folder: 'comments',
      });
    }

    await Comment.deleteOne({ _id: req.params.id }).exec();

    // Remove comment from the associated Post or Art
    // find the associated post or art
    let item = await Post.findById(comment.post);

    if (item) {
      // find the index where the comment is in the item's comments array
      const index = item.comments.indexOf(req.params.id);
      if (index > -1) {
        // delete comment from the array
        item.comments.splice(index, 1);
        await item.save();
      }
    }

    res.json(comment);
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
exports.replyToCmt = async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);
    // upload image to cloudinary
    let result;
    if (req.body.media) {
      result = await cloudinary.uploader.upload(req.body.media, {
        folder: 'comments',
      });
    }
    // Create a new reply (which is a Comment)
    let replyComment = new Comment({
      content: req.body.content,
      commentedBy: req.user.id, // ID from session or decoded JWT
      parentCommentId: comment._id,
      art: comment.art,
      post: comment.post,
      media: result
        ? {
            type: req.body.mediaType, //either 'image' or 'video'
            public_id: result.public_id,
            url: result.url,
          }
        : null,
    });
    let savedReply = await replyComment
      .save()
      .then((savedReply) =>
        savedReply.populate('commentedBy', 'username avatar'),
      );
    comment.replies.push(savedReply._id);
    comment = await comment.save();

    res.send(savedReply);
  } catch (error) {
    res.status(500).send(error);
  }
};
