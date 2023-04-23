const ApiError = require('../api-error');
const Post = require('../models/Post');
const User = require('../models/User');

exports.create = async (req, res, next) => {
  if (!req.body?.content) {
    return next(new ApiError(400, 'Text can not be empty'));
  }
  const post = new Post({
    user: req.user.id,
    content: req.body.content,
  });

  try {
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
exports.findAll = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate('user', 'username avatar');
    res.json(posts);
  } catch (error) {
    return next(new ApiError(500, 'An error occurred while retrieving post'));
  }
};
exports.findOne = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'user',
      'username avatar',
    );
    if (!post) {
      return next(new ApiError(404, 'Post not found'));
    }
    return res.json(post);
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

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // Make sure the logged in user matches the goal user
    if (post.user.toString() !== req.user.id) {
      return next(new ApiError(401, 'User not authorized'));
    }

    const deletePost = await post.remove();
    res.json(deletePost.id);
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
