const ApiError = require('../api-error');
const Post = require('../models/Post');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

exports.createPost = async (req, res, next) => {
  try {
    if (!req.body.content && !req.file) {
      return next(new ApiError(400, 'Either content or media is required.'));
    }

    // upload image to cloudinary
    let result;
    if (req.file) {
      result = await new Promise((resolve, reject) => {
        const streamLoad = cloudinary.uploader.upload_chunked_stream(
          { resource_type: req.body.mediaType, folder: 'posts' },
          function (error, result) {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );
        streamLoad.end(req.file.buffer);
      });
    }

    const post = new Post({
      user: req.user.id,
      privacy: req.body.privacy,
      content: req.body.content,
      media: result
        ? {
            mediaType: req.body.mediaType, //either 'image' or 'video'
            public_id: result.public_id,
            url: result.url,
          }
        : null,
    });
    const createPost = await post.save();

    res.json({
      ...createPost._doc,
      user: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
      },
    });
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while creating the post'));
  }
};
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar');
    posts.map((post) => {
      if (post.likes.includes(req.user._id.toString())) {
        post._doc.liked = true;
      }
    });
    res.json(posts);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while retrieving post'));
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const posts = await Art.find({ $nor: [{ privacy: 'Only me' }] })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');
    if (!posts) {
      return next(new ApiError(404, 'Post not found'));
    }
    posts.map((post) => {
      if (post.likes.includes(req.user._id.toString())) {
        post._doc.liked = true;
      }
    });
    return res.json(posts);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving post with id=${req.params.id}`),
    );
  }
};
exports.update = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ApiError(401, 'Post not found'));
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Make sure the logged in user matches the goal user
    if (post.user.toString() !== req.user.id) {
      return next(new ApiError(401, 'User not authorized'));
    }

    const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatePost);
  } catch (error) {
    return next(
      new ApiError(500, `Error updating post with id=${req.params.id}`),
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(new ApiError(401, 'Post not found'));
    }

    if (post.media.public_id) {
      await cloudinary.uploader.destroy(post.media.public_id, {
        folder: 'posts',
      });
    }

    const deletePost = await post.remove();
    res.json(deletePost.id);
    deleteAllComments(post._id, 'post');
  } catch (error) {
    return next(
      new ApiError(500, `Error updating post with id=${req.params.id}`),
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const deleteAllPosts = await Post.deleteMany({});
    res.json(deleteAllPosts);
  } catch (error) {
    return next(new ApiError(500, `Error deleting all user `));
  }
};
